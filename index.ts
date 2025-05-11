#!/usr/bin/env node

import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
  name: "GoodMorning",
  version: "1.0.0"
});

server.resource(
  "good-morning",
  new ResourceTemplate("good-morning://{message}", { list: undefined }),
  async (uri, { message }) => ({
    contents: [{
      uri: uri.href,
      text: `Good morning! Message: ${message}`
    }]
  })
);

server.tool(
  "good_morning",
  { message: z.string() },
  async ({ message }) => ({
    content: [{ type: "text", text: `Good morning! Your message: ${message}` }]
  })
);

server.prompt(
  "good-morning",
  { message: z.string() },
  ({ message }) => ({
    messages: [{
      role: "user",
      content: {
        type: "text",
        text: `Please respond to this morning greeting: ${message}`
      }
    }]
  })
);

const transport = new StdioServerTransport();
server.connect(transport);