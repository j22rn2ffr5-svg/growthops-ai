/**
 * Local dev server for /api/chat
 * Run this in a separate terminal: node api-dev.mjs
 * Vite proxies /api/* → http://localhost:3001 (see vite.config.js)
 *
 * Requires: ANTHROPIC_API_KEY in your .env file (loaded below via --env-file flag)
 * Usage:    node --env-file=.env api-dev.mjs
 */

import http from 'node:http'
import handler from './api/chat.js'

const PORT = 3001

const server = http.createServer((req, res) => {
  // Parse body
  let body = ''
  req.on('data', chunk => { body += chunk })
  req.on('end', () => {
    try {
      req.body = body ? JSON.parse(body) : {}
    } catch {
      req.body = {}
    }

    // Route: only handle /api/chat
    if (req.url === '/api/chat' || req.url === '/api/chat/') {
      handler(req, res)
    } else {
      res.writeHead(404)
      res.end('Not found')
    }
  })
})

server.listen(PORT, () => {
  console.log(`\n  ✅ API dev server running at http://localhost:${PORT}`)
  console.log('  Proxied via Vite at http://localhost:5173/api/chat\n')
})
