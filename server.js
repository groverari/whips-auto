import http from 'http'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PORT = 3002

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.svg': 'image/svg+xml',
  '.glb': 'model/gltf-binary',
  '.gltf': 'model/gltf+json',
  '.hdr': 'application/octet-stream',
  '.bin': 'application/octet-stream',
}

const server = http.createServer((req, res) => {
  let filePath = path.join(__dirname, 'dist', req.url === '/' ? 'index.html' : req.url)
  
  // Security: prevent directory traversal
  const realPath = path.resolve(filePath)
  const distPath = path.resolve(path.join(__dirname, 'dist'))
  if (!realPath.startsWith(distPath)) {
    res.writeHead(403)
    res.end('Forbidden')
    return
  }

  // Check if file exists
  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Serve index.html for SPA routing
      filePath = path.join(__dirname, 'dist', 'index.html')
    }

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404)
        res.end('Not Found')
        return
      }

      const ext = path.extname(filePath).toLowerCase()
      const contentType = mimeTypes[ext] || 'application/octet-stream'
      
      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600',
      })
      res.end(data)
    })
  })
})

server.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Whips Auto website running`)
  console.log(`🌐 Access via Tailscale: http://100.69.86.71:${PORT}`)
})
