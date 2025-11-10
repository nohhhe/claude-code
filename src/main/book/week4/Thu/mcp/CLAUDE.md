# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This repository contains a simple MCP (Model Context Protocol) server implementation called `simple-file-server`. It provides basic file operations (read, write, list) as MCP tools that can be integrated with Claude Code or other MCP-compatible clients.

## Architecture

The MCP server is built using the `@modelcontextprotocol/sdk` and follows the standard MCP server pattern:

- **Server Setup**: Creates a Server instance with stdio transport for communication
- **Tool Registration**: Registers three tools via `ListToolsRequestSchema` handler
- **Tool Execution**: Handles tool calls via `CallToolRequestSchema` handler
- **Error Handling**: Uses McpError for consistent error responses

### Core Tools
- `read_file`: Reads file contents using Node.js fs.readFile
- `write_file`: Writes content to files using Node.js fs.writeFile  
- `list_files`: Lists directory contents with file type information

## Development Commands

```bash
# Install dependencies
cd simple-file-server && npm install

# Start the MCP server (for testing)
cd simple-file-server && npm start

# Run the server directly
cd simple-file-server && node index.js
```

## MCP Integration

The server is configured in Claude Code settings at both global and project levels:

**Global scope**: `~/.claude/settings.json`
**Project scope**: `~/.claude.json` (current project path configuration)

Configuration format:
```json
"simple-file-server": {
  "type": "stdio",
  "command": "node",
  "args": ["/path/to/simple-file-server/index.js"],
  "env": {}
}
```

After configuration changes, restart Claude Code to load the MCP server. The tools will be available as:
- `mcp__simple-file-server__read_file`
- `mcp__simple-file-server__write_file` 
- `mcp__simple-file-server__list_files`