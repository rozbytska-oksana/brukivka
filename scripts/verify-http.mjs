import assert from 'node:assert/strict';
import { once } from 'node:events';
import { staticServer } from './static-server.mjs';
import { siteRoutes, sectionRedirects } from '../config/routes.ts';
const base = process.env.NUXT_APP_BASE_URL || '/';
const server = staticServer({ base });
server.listen(0, '127.0.0.1');
await once(server, 'listening');
const origin = `http://127.0.0.1:${server.address().port}`;
try {
  for (const route of siteRoutes) {
    const response = await fetch(`${origin}${base}${route.slice(1)}`);
    assert.equal(response.status, 200, route);
    assert.match(await response.text(), /<h1[ >]/, route);
  }
  for (const path of ['missing-route/', 'kataloh/missing-category/']) {
    const response = await fetch(`${origin}${base}${path}`);
    assert.equal(response.status, 404, path);
    assert.match(await response.text(), /Цей шлях ще не вимощено/, path);
  }
  for (const [route, section] of Object.entries(sectionRedirects)) {
    const response = await fetch(`${origin}${base}${route.slice(1)}`);
    assert.equal(response.status, 200, `Static redirect document: ${route}`);
    assert.ok((await response.text()).includes(`href="${base}#${section}"`), route);
  }
  const photo = await fetch(`${origin}${base}images/obcekt/1_1.jpg`);
  assert.equal(photo.status, 200);
  assert.match(photo.headers.get('content-type'), /image\/jpeg/);
  for (const [file, mime] of [
    ['favicon.svg', 'image/svg+xml'],
    ['favicon.ico', 'image/x-icon'],
    ['favicon-16x16.png', 'image/png'],
    ['favicon-32x32.png', 'image/png'],
    ['apple-touch-icon.png', 'image/png'],
  ]) {
    const icon = await fetch(`${origin}${base}${file}`);
    assert.equal(icon.status, 200, file);
    assert.equal(icon.headers.get('content-type'), mime, file);
    assert.ok((await icon.arrayBuffer()).byteLength > 0, file);
  }
  console.log(
    `HTTP: ${siteRoutes.length} direct routes, original photo, five brand icons and two real 404 responses; ${Object.keys(sectionRedirects).length} static redirect documents; base=${base}. Local server only, hosting remains unverified.`,
  );
} finally {
  server.closeAllConnections();
  server.close();
}
