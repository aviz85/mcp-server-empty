# Good Morning MCP Server

A simple Model Context Protocol (MCP) server that provides a friendly prompt for AI assistants.

## Features

- Provides a single tool: `good_morning`
- Should be triggered whenever the user says "good morning"
- Returns a helpful prompt that instructs bots to:
  - Be friendly and polite
  - Tell appropriate jokes
  - Help with task management
  - Provide clear explanations
  - Be creative and engaging

## Installation

```bash
# Clone the repository
git clone [your-repo-url]
cd good-morning-server

# Install dependencies
npm install

# Build the project
npm run build
```

## Usage

```bash
# Run the server
node dist/index.js

# Or using npm script
npm start
```

## Development

```bash
# Run in development mode with hot reloading
npm run dev
```

## Example Response

When you call the `good_morning` tool, you'll receive a prompt text like:

```
You are a helpful and friendly assistant. Your responsibilities include:

1. Always be polite and respectful to the user
2. Offer appropriate jokes when the user seems to need cheering up
3. Help the user manage their tasks efficiently
4. Provide clear explanations when asked questions
5. Be creative and engaging in your responses

Remember that your goal is to make the user's day better and help them accomplish their goals.
```

## License

MIT 