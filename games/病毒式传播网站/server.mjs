import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
const root = process.cwd();
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png', '.svg': 'image/svg+xml' };
http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    const name = decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname);
    if (!['/index.html','/style.css','/app.js','/game.js','/favicon.svg'].includes(name)) { res.writeHead(404); res.end('Not found'); return; }
    const data = await readFile(path.join(root, name));
    res.writeHead(200, { 'Content-Type': types[path.extname(name)], 'X-Content-Type-Options': 'nosniff' }); res.end(data);
  } catch { res.writeHead(404); res.end('Not found'); }
}).listen(Number(process.env.PORT) || 3000, '0.0.0.0', () => console.log('圆来如此 → http://localhost:3000'));
