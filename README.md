# Good Morning MCP Server

A simple Model Context Protocol (MCP) server that provides helpful prompts and tools.

## Installation

```bash
# Install dependencies
npm install
```

## Running the Server

```bash
# Build and run the server
npm start

# Alternatively, for development with hot reloading
npm run dev
```

## Available Features

1. **Good Morning Resource**: `good-morning://{message}`
2. **Good Morning Tool**: Simple greeting tool
3. **Starter Assistant Prompt**: Calendar, weather, and mood-based assistant
4. **Marketing Writer Prompt**: Creates marketing content based on topic

## Troubleshooting

If you encounter the "Cannot find module '/path/to/index.js'" error:

1. Make sure TypeScript is installed: `npm install -g typescript`
2. Build the project manually: `npx tsc`
3. Verify the dist folder contains compiled JavaScript files
4. Run with the correct path: `node dist/index.js`

## MCP Configuration

To configure the server in your MCP setup:

```json
{
  "mcpServers": {
    "good-morning": {
      "command": "node",
      "args": [
        "/full/path/to/dist/index.js"
      ]
    }
  }
}
```

## Features

- Provides a single tool: `good_morning`
- Should be triggered whenever the user says "good morning"
- Returns a helpful prompt that instructs bots to:
  - Be friendly and polite
  - Tell appropriate jokes
  - Help with task management
  - Provide clear explanations
  - Be creative and engaging

## Example Response

When you call the `good_morning` tool, you'll receive a prompt text like:

```