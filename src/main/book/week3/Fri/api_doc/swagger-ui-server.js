const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

const app = express();
const PORT = process.env.SWAGGER_PORT || 3001;

// Load OpenAPI specification
const swaggerDocument = YAML.load(path.join(__dirname, 'openapi.yaml'));

// Swagger UI options
const options = {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'API Documentation',
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    filter: true,
    tryItOutEnabled: true
  }
};

// Serve Swagger UI
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));

// Redirect root to docs
app.get('/', (req, res) => {
  res.redirect('/docs');
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'swagger-ui-server' });
});

// Serve raw OpenAPI spec
app.get('/openapi.yaml', (req, res) => {
  res.sendFile(path.join(__dirname, 'openapi.yaml'));
});

app.get('/openapi.json', (req, res) => {
  res.json(swaggerDocument);
});

app.listen(PORT, () => {
  console.log(`📚 Swagger UI Server running on http://localhost:${PORT}`);
  console.log(`📖 API Documentation: http://localhost:${PORT}/docs`);
  console.log(`📄 OpenAPI YAML: http://localhost:${PORT}/openapi.yaml`);
  console.log(`📄 OpenAPI JSON: http://localhost:${PORT}/openapi.json`);
});

module.exports = app;