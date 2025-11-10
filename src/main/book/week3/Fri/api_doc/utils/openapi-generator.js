const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

/**
 * OpenAPI 3.0 Specification Generator
 * Analyzes Express.js route files and generates OpenAPI documentation
 */
class OpenAPIGenerator {
  constructor(options = {}) {
    this.options = {
      routesDir: options.routesDir || './routes',
      outputPath: options.outputPath || './openapi.yaml',
      apiInfo: {
        title: options.title || 'API Documentation',
        version: options.version || '1.0.0',
        description: options.description || 'Auto-generated API documentation',
        ...options.apiInfo
      },
      servers: options.servers || [
        { url: 'http://localhost:3000', description: 'Development server' }
      ]
    };

    this.spec = {
      openapi: '3.0.0',
      info: this.options.apiInfo,
      servers: this.options.servers,
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT'
          }
        },
        schemas: {}
      },
      paths: {}
    };
  }

  /**
   * Parse route file and extract route information
   * @param {string} filePath - Path to route file
   * @returns {Array} Array of route objects
   */
  parseRouteFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const routes = [];

    // Regular expressions to extract route information
    const routeRegex = /router\.(get|post|put|delete|patch)\s*\(\s*['"`]([^'"`]+)['"`]/g;
    const commentRegex = /\/\*\*\s*([\s\S]*?)\*\//g;

    let match;
    const comments = [];
    
    // Extract all JSDoc comments
    while ((match = commentRegex.exec(content)) !== null) {
      comments.push({
        content: match[1],
        index: match.index
      });
    }

    // Extract all routes
    while ((match = routeRegex.exec(content)) !== null) {
      const method = match[1].toLowerCase();
      const routePath = match[2];
      const routeIndex = match.index;

      // Find the closest preceding comment
      const relevantComment = comments
        .filter(comment => comment.index < routeIndex)
        .sort((a, b) => b.index - a.index)[0];

      let routeInfo = {
        method,
        path: routePath,
        summary: `${method.toUpperCase()} ${routePath}`,
        description: '',
        tags: [],
        parameters: [],
        requestBody: null,
        responses: {},
        security: []
      };

      if (relevantComment) {
        routeInfo = this.parseJSDocComment(relevantComment.content, routeInfo);
      }

      // Auto-detect parameters from path
      const pathParams = routePath.match(/:([^/\s]+)/g);
      if (pathParams) {
        pathParams.forEach(param => {
          const paramName = param.substring(1);
          if (!routeInfo.parameters.find(p => p.name === paramName)) {
            routeInfo.parameters.push({
              in: 'path',
              name: paramName,
              required: true,
              schema: { type: 'string' },
              description: `${paramName} parameter`
            });
          }
        });
      }

      routes.push(routeInfo);
    }

    return routes;
  }

  /**
   * Parse JSDoc comment and extract OpenAPI information
   * @param {string} comment - JSDoc comment content
   * @param {Object} routeInfo - Base route information
   * @returns {Object} Enhanced route information
   */
  parseJSDocComment(comment, routeInfo) {
    const lines = comment.split('\n').map(line => line.trim().replace(/^\*\s?/, ''));
    
    lines.forEach(line => {
      if (line.startsWith('@route ')) {
        const routeMatch = line.match(/@route\s+(\w+)\s+(.+)/);
        if (routeMatch) {
          routeInfo.method = routeMatch[1].toLowerCase();
          routeInfo.path = routeMatch[2];
        }
      } else if (line.startsWith('@description ')) {
        routeInfo.description = line.replace('@description ', '');
      } else if (line.startsWith('@access ')) {
        const access = line.replace('@access ', '');
        if (access.toLowerCase() === 'private' || access.toLowerCase().includes('admin')) {
          routeInfo.security = [{ bearerAuth: [] }];
        }
      } else if (line.startsWith('@param ')) {
        const paramMatch = line.match(/@param\s+\{([^}]+)\}\s+(\w+)\s*-?\s*(.*)/);
        if (paramMatch) {
          const [, type, name, description] = paramMatch;
          const param = {
            name,
            description: description || `${name} parameter`,
            schema: this.parseTypeToSchema(type)
          };

          // Determine parameter location
          if (routeInfo.path.includes(`:${name}`)) {
            param.in = 'path';
            param.required = true;
          } else if (routeInfo.method === 'get') {
            param.in = 'query';
            param.required = type.includes('required');
          } else {
            // Body parameter - will be handled in requestBody
            return;
          }

          routeInfo.parameters.push(param);
        }
      } else if (line.startsWith('@returns ')) {
        const returnMatch = line.match(/@returns\s+(?:\{([^}]+)\}\s+)?(\d+)\s*-?\s*(.*)/);
        if (returnMatch) {
          const [, type, statusCode, description] = returnMatch;
          routeInfo.responses[statusCode] = {
            description: description || `Response ${statusCode}`,
            ...(type && type !== 'void' && {
              content: {
                'application/json': {
                  schema: this.parseTypeToSchema(type)
                }
              }
            })
          };
        }
      } else if (line.startsWith('@security ')) {
        const security = line.replace('@security ', '');
        if (security.toLowerCase().includes('bearer')) {
          routeInfo.security = [{ bearerAuth: [] }];
        }
      } else if (!line.startsWith('@') && line.length > 0 && !routeInfo.summary) {
        routeInfo.summary = line;
      }
    });

    // Add default responses if none specified
    if (Object.keys(routeInfo.responses).length === 0) {
      routeInfo.responses = this.getDefaultResponses(routeInfo.method);
    }

    // Set default tags
    if (routeInfo.tags.length === 0) {
      const pathSegments = routeInfo.path.split('/').filter(Boolean);
      if (pathSegments.length > 0) {
        routeInfo.tags = [pathSegments[0].charAt(0).toUpperCase() + pathSegments[0].slice(1)];
      }
    }

    return routeInfo;
  }

  /**
   * Parse type string to OpenAPI schema
   * @param {string} typeStr - Type string (e.g., "string", "User", "Array<User>")
   * @returns {Object} OpenAPI schema object
   */
  parseTypeToSchema(typeStr) {
    if (!typeStr) return { type: 'string' };

    const type = typeStr.toLowerCase().trim();
    
    if (type === 'string') return { type: 'string' };
    if (type === 'number' || type === 'integer') return { type: 'integer' };
    if (type === 'boolean') return { type: 'boolean' };
    if (type === 'array') return { type: 'array', items: { type: 'string' } };
    if (type === 'object') return { type: 'object' };
    if (type === 'void') return {};

    // Custom types (assumed to be refs)
    if (type === 'user') return { $ref: '#/components/schemas/User' };
    if (type === 'error') return { $ref: '#/components/schemas/ErrorResponse' };

    return { type: 'string' };
  }

  /**
   * Get default responses for HTTP method
   * @param {string} method - HTTP method
   * @returns {Object} Default responses object
   */
  getDefaultResponses(method) {
    const commonResponses = {
      '500': {
        description: 'Internal server error',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' }
          }
        }
      }
    };

    switch (method) {
    case 'post':
      return {
        '201': { description: 'Created successfully' },
        '400': { description: 'Bad request' },
        ...commonResponses
      };
    case 'get':
      return {
        '200': { description: 'Success' },
        '404': { description: 'Not found' },
        ...commonResponses
      };
    case 'put':
    case 'patch':
      return {
        '200': { description: 'Updated successfully' },
        '404': { description: 'Not found' },
        ...commonResponses
      };
    case 'delete':
      return {
        '204': { description: 'Deleted successfully' },
        '404': { description: 'Not found' },
        ...commonResponses
      };
    default:
      return {
        '200': { description: 'Success' },
        ...commonResponses
      };
    }
  }

  /**
   * Generate common schemas
   */
  generateCommonSchemas() {
    this.spec.components.schemas = {
      User: {
        type: 'object',
        required: ['email', 'name'],
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            example: '123e4567-e89b-12d3-a456-426614174000'
          },
          email: {
            type: 'string',
            format: 'email',
            example: 'user@example.com'
          },
          name: {
            type: 'string',
            minLength: 2,
            maxLength: 100,
            example: 'John Doe'
          },
          role: {
            type: 'string',
            enum: ['user', 'admin'],
            default: 'user'
          },
          createdAt: {
            type: 'string',
            format: 'date-time'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time'
          }
        }
      },
      CreateUserRequest: {
        type: 'object',
        required: ['email', 'name', 'password'],
        properties: {
          email: {
            type: 'string',
            format: 'email'
          },
          name: {
            type: 'string',
            minLength: 2,
            maxLength: 100
          },
          password: {
            type: 'string',
            format: 'password',
            minLength: 8
          }
        }
      },
      UpdateUserRequest: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            minLength: 2,
            maxLength: 100
          },
          email: {
            type: 'string',
            format: 'email'
          }
        }
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          error: {
            type: 'string',
            description: 'Error message'
          },
          code: {
            type: 'string',
            description: 'Error code'
          },
          details: {
            type: 'object',
            description: 'Additional error details'
          }
        }
      }
    };
  }

  /**
   * Convert Express path to OpenAPI path
   * @param {string} expressPath - Express.js path (e.g., "/users/:id")
   * @returns {string} OpenAPI path (e.g., "/users/{id}")
   */
  convertPathToOpenAPI(expressPath) {
    return expressPath.replace(/:([^/]+)/g, '{$1}');
  }

  /**
   * Generate OpenAPI specification
   * @returns {Object} Complete OpenAPI specification
   */
  generate() {
    this.generateCommonSchemas();

    // Read all route files
    const routeFiles = fs.readdirSync(this.options.routesDir)
      .filter(file => file.endsWith('.js'))
      .map(file => path.join(this.options.routesDir, file));

    // Process each route file
    routeFiles.forEach(filePath => {
      const routes = this.parseRouteFile(filePath);
      
      routes.forEach(route => {
        const openApiPath = this.convertPathToOpenAPI(route.path);
        const fullPath = openApiPath.startsWith('/api') ? openApiPath : `/api${openApiPath}`;

        if (!this.spec.paths[fullPath]) {
          this.spec.paths[fullPath] = {};
        }

        // Clean up route object for OpenAPI spec
        const {
          method,
          path: _path,
          ...openApiRoute
        } = route;

        this.spec.paths[fullPath][method] = openApiRoute;
      });
    });

    return this.spec;
  }

  /**
   * Generate and save OpenAPI specification as YAML
   */
  generateYAML() {
    const spec = this.generate();
    const yamlContent = yaml.dump(spec, {
      indent: 2,
      lineWidth: 120,
      noRefs: true
    });

    fs.writeFileSync(this.options.outputPath, yamlContent, 'utf8');
    
    console.log(`OpenAPI specification generated: ${this.options.outputPath}`);
    return yamlContent;
  }

  /**
   * Generate and save OpenAPI specification as JSON
   */
  generateJSON() {
    const spec = this.generate();
    const jsonPath = this.options.outputPath.replace(/\.ya?ml$/, '.json');
    
    fs.writeFileSync(jsonPath, JSON.stringify(spec, null, 2), 'utf8');
    
    console.log(`OpenAPI specification generated: ${jsonPath}`);
    return spec;
  }
}

module.exports = OpenAPIGenerator;

// CLI usage
if (require.main === module) {
  const generator = new OpenAPIGenerator({
    title: 'User Management API',
    version: '1.0.0',
    description: 'RESTful API for user management operations',
    servers: [
      { url: 'http://localhost:3000', description: 'Development server' },
      { url: 'https://api.example.com', description: 'Production server' }
    ]
  });

  try {
    generator.generateYAML();
    console.log('✅ OpenAPI specification generated successfully!');
  } catch (error) {
    console.error('❌ Failed to generate OpenAPI specification:', error.message);
    process.exit(1);
  }
}