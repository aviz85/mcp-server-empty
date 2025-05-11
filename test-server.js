#!/usr/bin/env node

/**
 * Simple test script for the Good Morning MCP Server
 * This script demonstrates how to use the server with a basic example call
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Prepare server process
const serverProcess = spawn('node', [
  'dist/index.js'
], {
  stdio: ['pipe', 'pipe', 'inherit'] // We pipe stdin/stdout and inherit stderr
});

// Sample MCP request
const listToolsRequest = {
  jsonrpc: '2.0',
  id: '1',
  method: 'mcp.listTools',
  params: {}
};

// Wait for server to start
setTimeout(() => {
  console.log('Sending listTools request to server...');
  
  // Write the request to server's stdin
  serverProcess.stdin.write(JSON.stringify(listToolsRequest) + '\n');
  
  // Handle server response
  let responseData = '';
  serverProcess.stdout.on('data', (data) => {
    responseData += data.toString();
    
    try {
      // Try to parse any complete JSON responses
      const lines = responseData.split('\n');
      for (let i = 0; i < lines.length - 1; i++) {
        const line = lines[i].trim();
        if (line) {
          const response = JSON.parse(line);
          console.log('Received response:', JSON.stringify(response, null, 2));
          
          // If we got tools list, try using the good_morning tool
          if (response.result && response.result.tools) {
            console.log('Testing good_morning tool...');
            const goodMorningRequest = {
              jsonrpc: '2.0',
              id: '2',
              method: 'mcp.callTool',
              params: {
                name: 'good_morning',
                arguments: {}
              }
            };
            
            serverProcess.stdin.write(JSON.stringify(goodMorningRequest) + '\n');
          }
        }
      }
      
      // Keep any incomplete data
      responseData = lines[lines.length - 1];
    } catch (err) {
      // Incomplete JSON, continue collecting data
    }
  });
  
  // Terminate the server after some time
  setTimeout(() => {
    console.log('Test complete, terminating server...');
    serverProcess.kill();
    process.exit(0);
  }, 3000);
}, 1000);

// Handle process termination
process.on('SIGINT', () => {
  serverProcess.kill();
  process.exit(0);
}); 