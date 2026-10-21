import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname } from 'node:path';

export function staticServer({ root = '.output/public', base = '/' } = {}) {
  const directory = resolve(root);
  const mime = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.jpg': 'image/jpeg',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff2': 'font/woff2',
    '.json': 'application/json',
    '.xml': 'application/xml',
    '.txt': 'text/plain',
  };
  return createServer(async (req, res) => {
    try {
      const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
      if (!pathname.startsWith(base)) throw new Error('Outside base');
      let file = resolve(directory, pathname.slice(base.length));
      if (file !== directory && !file.startsWith(directory + '/')) throw new Error('Outside root');
      if ((await stat(file)).isDirectory()) {
        if (!pathname.endsWith('/')) {
          res.writeHead(301, { Location: pathname + '/' });
          res.end();
          return;
        }
        file = resolve(file, 'index.html');
      }
      const data = await readFile(file);
      res.writeHead(200, { 'Content-Type': mime[extname(file)] || 'application/octet-stream' });
      res.end(req.method === 'HEAD' ? undefined : data);
    } catch {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(await readFile(resolve(directory, '404.html')));
    }
  });
}
if (import.meta.url === `file://${process.argv[1]}`) {
  const base = process.env.NUXT_APP_BASE_URL || '/';
  staticServer({ base }).listen(4173, '127.0.0.1', () =>
    console.log(`Local static preview: http://127.0.0.1:4173${base}`),
  );
}
