#!/bin/bash
set -exo pipefail

CURRENT_DIR=$(pwd)
MCP_SIMPLE_FILE_SERVER_PATH="$CURRENT_DIR/simple-file-server/index.js"

claude mcp add -s project github github-mcp-server stdio --env GITHUB_PERSONAL_ACCESS_TOKEN=${GITHUB_PERSONAL_ACCESS_TOKEN}
claude mcp add -s project kubernetes npx -- -y kubernetes-mcp-server@latest
claude mcp add -s project context7 --transport sse https://mcp.context7.com/sse
claude mcp add -s project playwright npx -- -y @playwright/mcp@latest
claude mcp add -s project serena uvx -- --from git+https://github.com/oraios/serena serena-mcp-server --enable-web-dashboard true
claude mcp add -s project sequential-thinking npx -- -y @modelcontextprotocol/server-sequential-thinking
claude mcp add -s project simple-file-server node -- $MCP_SIMPLE_FILE_SERVER_PATH
claude mcp list
