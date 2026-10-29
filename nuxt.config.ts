import { writeFile, mkdir, copyFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { readFileSync } from 'node:fs';
import { siteRoutes, sectionRedirects } from './config/routes';
import { businessContacts } from './app/data/contacts';

const target = process.env.BRUKIVKA_TARGET || 'production';
if (!['demo', 'production'].includes(target))
  throw new Error('BRUKIVKA_TARGET must be demo or production');
const production = target === 'production';
const baseURL = process.env.NUXT_APP_BASE_URL || '/';
if (!baseURL.startsWith('/') || !baseURL.endsWith('/'))
  throw new Error('NUXT_APP_BASE_URL must start/end with /');
const rawURL = process.env.BRUKIVKA_SITE_URL || (production ? businessContacts.siteURL : '');
const siteURL = rawURL ? `${rawURL.replace(/\/$/, '')}/` : '';
if (siteURL) {
  const url = new URL(siteURL);
  if (
    !['https:', 'http:'].includes(url.protocol) ||
    url.pathname !== baseURL ||
    url.search ||
    url.hash
  )
    throw new Error('SITE_URL must be the full deployment URL including base path');
}
if (production && !siteURL) throw new Error('Production needs a site URL');
const indexable = production && process.env.BRUKIVKA_ALLOW_INDEXING === 'true';
// Inline the small font declarations to avoid a render-blocking stylesheet request.
// Font binaries remain local, unicode-range selected, and deployment-base aware.
const fontStyles = readFileSync(
  new URL('./public/fonts/fonts.css', import.meta.url),
  'utf8',
).replace(/url\((font-\d+\.woff2)\)/g, `url(${baseURL}fonts/$1)`);
if (indexable && !siteURL.startsWith('https://'))
  throw new Error('An indexable production build needs an HTTPS site URL');

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  ssr: true,
  devtools: { enabled: false },
  features: { inlineStyles: true },
  css: ['~/assets/styles/main.scss'],
  app: {
    baseURL,
    head: {
      htmlAttrs: { lang: 'uk' },
      link: [
        {
          rel: 'icon',
          type: 'image/x-icon',
          sizes: '16x16 32x32 48x48',
          href: `${baseURL}favicon.ico`,
        },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: `${baseURL}favicon-16x16.png` },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: `${baseURL}favicon-32x32.png` },
        { rel: 'icon', type: 'image/svg+xml', sizes: 'any', href: `${baseURL}favicon.svg` },
        { rel: 'apple-touch-icon', sizes: '180x180', href: `${baseURL}apple-touch-icon.png` },
      ],
      style: [{ key: 'local-fonts', innerHTML: fontStyles }],
      titleTemplate: '%s · BRUKIVKA',
      meta: [
        { name: 'color-scheme', content: 'dark light' },
        { name: 'robots', content: indexable ? 'index, follow' : 'noindex, nofollow' },
      ],
      script: [
        {
          innerHTML:
            "try{var t=localStorage.getItem('brukivka-theme');document.documentElement.dataset.theme=t==='light'?'light':'dark'}catch(e){document.documentElement.dataset.theme='dark'}",
          tagPosition: 'head',
          key: 'theme-init',
        },
      ],
    },
  },
  runtimeConfig: { public: { siteURL, demo: !production, indexable } },
  typescript: { strict: true },
  nitro: {
    prerender: {
      crawlLinks: true,
      failOnError: true,
      routes: [...siteRoutes, '/404/'],
      ignore: ['/200.html'],
    },
  },
  hooks: {
    'nitro:init'(nitro) {
      nitro.hooks.hook('prerender:done', async () => {
        const output = resolve(nitro.options.output.publicDir);
        await mkdir(output, { recursive: true });
        const sitemap = siteURL
          ? `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${siteRoutes.map((route) => `<url><loc>${new URL(route.slice(1), siteURL).href.replaceAll('&', '&amp;').replaceAll('<', '&lt;')}</loc></url>`).join('')}</urlset>\n`
          : '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"/>\n';
        await writeFile(resolve(output, 'sitemap.xml'), sitemap);
        await writeFile(
          resolve(output, 'robots.txt'),
          // Crawlers must read the HTML noindex directive in preview/demo builds.
          `User-agent: *\nAllow: /\n${siteURL ? `Sitemap: ${siteURL}sitemap.xml\n` : ''}`,
        );
        await writeFile(resolve(output, '.nojekyll'), '');
        // Static hosts cannot issue application-level HTTP redirects. Preserve old
        // bookmarks with a no-JS-compatible document; Apache rules provide real 301.
        for (const [route, section] of Object.entries(sectionRedirects)) {
          const destination = `${baseURL}#${section}`;
          const directory = resolve(output, `.${route}`);
          await mkdir(directory, { recursive: true });
          await writeFile(
            resolve(directory, 'index.html'),
            `<!DOCTYPE html><html lang="uk"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex, follow"><meta http-equiv="refresh" content="0;url=${destination}"><title>Перехід до розділу · BRUKIVKA</title>${siteURL ? `<link rel="canonical" href="${siteURL}">` : ''}</head><body><p>Розділ тепер на головній. <a href="${destination}">Відкрити розділ</a></p><script>location.replace(${JSON.stringify(destination)})</script></body></html>`,
          );
        }
        // Nuxt's default static fallback is a JS-only shell. Serve readable HTML on 404.
        await copyFile(resolve(output, '404/index.html'), resolve(output, '404.html'));
      });
    },
  },
});
