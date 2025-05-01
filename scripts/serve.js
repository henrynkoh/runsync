const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const OUT_DIR = path.join(__dirname, '../out');

const server = http.createServer((req, res) => {
  // Default to index.html for root path
  let filePath = req.url === '/' ? '/index.html' : req.url;
  
  // Handle /training route
  if (filePath === '/training') {
    filePath = '/training.html';
  }
  
  // Get the file extension
  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.svg': 'image/svg+xml',
    '.wav': 'audio/wav',
    '.mp3': 'audio/mpeg',
  }[extname] || 'application/octet-stream';
  
  const fullPath = path.join(OUT_DIR, filePath);
  
  fs.readFile(fullPath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // Try loading the 404 page
        fs.readFile(path.join(OUT_DIR, '/404.html'), (err, content) => {
          if (err) {
            res.writeHead(404);
            res.end('404 Not Found');
          } else {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end(content, 'utf-8');
          }
        });
      } else {
        // Server error
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      // Success
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log(`For iPhone testing, make sure your phone is on the same WiFi network`);
  
  // Try to get the local IP address
  try {
    const { networkInterfaces } = require('os');
    const nets = networkInterfaces();
    
    for (const name of Object.keys(nets)) {
      for (const net of nets[name]) {
        // Skip internal (i.e. 127.0.0.1) and non-ipv4 addresses
        if (net.family === 'IPv4' && !net.internal) {
          console.log(`Access from your iPhone at: http://${net.address}:${PORT}/`);
        }
      }
    }
  } catch (err) {
    console.log('Could not determine local IP address');
  }
}); 