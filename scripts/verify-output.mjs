import assert from 'node:assert/strict';
import { lstat, readFile, readdir, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import { siteRoutes, sectionRedirects } from '../config/routes.ts';
import { sectionNavigation } from '../app/data/navigation.ts';
import { businessContacts } from '../app/data/contacts.ts';
import { categories } from '../app/data/categories.ts';
import { assetDimensions } from '../app/data/available-assets.ts';
import { editedImages, editedImageDimensions } from '../app/data/edited-images.ts';

const base = process.env.NUXT_APP_BASE_URL || '/';
const demo = (process.env.BRUKIVKA_TARGET || 'production') === 'demo';
const indexable = !demo && process.env.BRUKIVKA_ALLOW_INDEXING === 'true';
const site =
  process.env.BRUKIVKA_SITE_URL?.replace(/\/?$/, '/') || (demo ? '' : businessContacts.siteURL);
const output = resolve('.output/public');
const editedDirectory = 'images/edited';
const editedFiles = (await readdir(resolve('public', editedDirectory))).sort();
assert.deepEqual(
  (await readdir(resolve(output, editedDirectory))).sort(),
  editedFiles,
  'No stale or missing edited images in the release output',
);
for (const file of editedFiles) {
  assert.ok(
    (await readFile(resolve(output, editedDirectory, file))).equals(
      await readFile(resolve('public', editedDirectory, file)),
    ),
    `Current edited image bytes in output: ${file}`,
  );
}
// Only the generated site is deployable; sources, local settings and link-based
// copies cannot enter the Pages artifact.
for (const name of await readdir(output)) {
  assert.ok(
    ![
      'app',
      'config',
      'deployment',
      'docs',
      'node_modules',
      'reference',
      'scripts',
      'tests',
    ].includes(name) &&
      name !== 'AGENTS.md' &&
      !name.startsWith('.env') &&
      !/^package(?:-lock)?\.json$/.test(name) &&
      !/^nuxt\.config\./.test(name),
    `Source/configuration excluded from deployment: ${name}`,
  );
}
async function verifyArtifactFiles(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name);
    const info = await lstat(path);
    assert.ok(!info.isSymbolicLink(), `No symlinks in Pages artifact: ${path}`);
    if (info.isDirectory()) await verifyArtifactFiles(path);
    else {
      assert.ok(info.isFile(), `Regular artifact file: ${path}`);
      assert.equal(info.nlink, 1, `No hard links in Pages artifact: ${path}`);
    }
  }
}
await verifyArtifactFiles(output);
const titles = new Set();
const descriptions = new Set();
let checked = 0;
function metaValues(html, name) {
  return [...html.matchAll(/<meta\b[^>]*>/g)]
    .map((match) => match[0])
    .filter((tag) => tag.includes(`name="${name}"`) || tag.includes(`property="${name}"`))
    .map((tag) => tag.match(/\bcontent="([^"]*)"/)?.[1]);
}

function schemasIn(html) {
  return [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs)].map(
    (match) => JSON.parse(match[1]),
  );
}
const homeHTML = await readFile(resolve(output, 'index.html'), 'utf8');
for (const { id } of sectionNavigation)
  assert.ok(homeHTML.includes(`id="${id}"`), `Landing section: ${id}`);
const primaryNav = homeHTML.match(
  /<nav[^>]+aria-label="Основна навігація"[^>]*>(.*?)<\/nav>/s,
)?.[1];
assert.ok(primaryNav, 'Primary navigation is server-rendered');
assert.doesNotMatch(
  primaryNav,
  /aria-current=/,
  'The URL fragment is unavailable during prerender; active section is set after hydration',
);
assert.match(
  homeHTML,
  new RegExp(
    `<time[^>]*datetime="${businessContacts.sinceYear}"[^>]*>\\s*${businessContacts.sinceYear} року\\s*</time>`,
  ),
  'Confirmed business start year is visible in the hero',
);
if (!demo) {
  for (const tag of ['textarea', 'select']) {
    const control = homeHTML.match(new RegExp(`<${tag}\\b[^>]*>`))?.[0];
    assert.ok(control, `Enquiry ${tag} is server-rendered`);
    assert.doesNotMatch(control, /\bdisabled\b/, `Enquiry ${tag} is enabled`);
  }
  for (const channel of ['email', 'whatsapp', 'viber'])
    assert.ok(
      homeHTML.includes(`<option value="${channel}"`),
      `Enquiry channel available: ${channel}`,
    );
  const schemas = schemasIn(homeHTML);
  const business = schemas.find((schema) => schema['@type'] === 'LocalBusiness');
  assert.equal(
    business?.foundingDate,
    String(businessContacts.sinceYear),
    'Structured date matches the confirmed visible year',
  );
  assert.equal(business['@id'], `${site}#business`);
  assert.equal(business.logo.url, `${site}brand/icon-512.png`);
  assert.equal(business.logo.width, 512);
  assert.ok((await stat(resolve(output, 'brand/icon-512.png'))).isFile());
}
const galleryIds = new Set();
for (const route of siteRoutes) {
  const file = resolve(output, `.${route}`, 'index.html');
  const html = await readFile(file, 'utf8');
  assert.equal((html.match(/<h1[ >]/g) || []).length, 1, `One H1: ${route}`);
  assert.match(html, /<html[^>]+lang="uk"/, `Ukrainian document: ${route}`);
  assert.doesNotMatch(
    html,
    /NuxtWelcome|reveal-ready/,
    `SSR content is visible without JS: ${route}`,
  );
  const noJsNavigation = html.match(/<noscript\b[^>]*>(.*?)<\/noscript>/s)?.[1];
  assert.ok(noJsNavigation, `No-JS navigation is server-rendered: ${route}`);
  for (const { id } of sectionNavigation) {
    assert.ok(
      noJsNavigation.includes(`href="${base}#${id}"`),
      `No-JS base-safe link: ${route}#${id}`,
    );
  }
  const headLinks = [...html.matchAll(/<link\b[^>]*>/g)].map((match) => match[0]);
  for (const [rel, sizes, filename] of [
    ['icon', '16x16 32x32 48x48', 'favicon.ico'],
    ['icon', '16x16', 'favicon-16x16.png'],
    ['icon', '32x32', 'favicon-32x32.png'],
    ['icon', 'any', 'favicon.svg'],
    ['apple-touch-icon', '180x180', 'apple-touch-icon.png'],
  ]) {
    assert.ok(
      headLinks.some(
        (link) =>
          link.includes(`rel="${rel}"`) &&
          link.includes(`sizes="${sizes}"`) &&
          link.includes(`href="${base}${filename}"`),
      ),
      `Base-safe brand icon: ${route} ${filename}`,
    );
  }
  for (const className of ['brand', 'footer-brand']) {
    const brandLink = html.match(
      new RegExp(`<a\\b[^>]*class="(?:[^"]* )?${className}(?: [^"]*)?"[^>]*>(.*?)</a>`, 's'),
    );
    assert.ok(brandLink, `Brand home link: ${route} ${className}`);
    assert.match(brandLink[0], /aria-label="BRUKIVKA — головна"/, `Accessible brand: ${route}`);
    assert.match(brandLink[1], /<svg\b[^>]*aria-hidden="true"/, `Inline vector logo: ${route}`);
  }
  const title = html.match(/<title>(.*?)<\/title>/s)?.[1];
  const description = html.match(/<meta name="description" content="([^"]+)"/)?.[1];
  assert.ok(title && !titles.has(title), `Unique title: ${route}`);
  assert.ok(description && !descriptions.has(description), `Unique description: ${route}`);
  titles.add(title);
  descriptions.add(description);
  assert.equal((html.match(/<title>/g) || []).length, 1, `One title: ${route}`);
  assert.equal(metaValues(html, 'description').length, 1, `One description: ${route}`);
  assert.deepEqual(
    metaValues(html, 'robots'),
    [indexable ? 'index, follow' : 'noindex, nofollow'],
    `Explicit indexing policy: ${route}`,
  );
  assert.deepEqual(metaValues(html, 'og:title'), [title], `Matching OG title: ${route}`);
  assert.deepEqual(
    metaValues(html, 'og:description'),
    [description],
    `Matching OG description: ${route}`,
  );
  assert.deepEqual(metaValues(html, 'og:site_name'), ['BRUKIVKA'], `OG site name: ${route}`);
  assert.deepEqual(metaValues(html, 'og:locale'), ['uk_UA'], `OG locale: ${route}`);
  assert.deepEqual(
    metaValues(html, 'twitter:card'),
    ['summary_large_image'],
    `Social card: ${route}`,
  );
  assert.deepEqual(metaValues(html, 'twitter:title'), [title], `Matching social title: ${route}`);
  assert.deepEqual(
    metaValues(html, 'twitter:description'),
    [description],
    `Matching social description: ${route}`,
  );
  assert.equal(metaValues(html, 'og:image:alt').length, 1, `OG image alt: ${route}`);
  assert.equal(metaValues(html, 'twitter:image:alt').length, 1, `Social image alt: ${route}`);
  const schemas = schemasIn(html);
  assert.ok(schemas.every((schema) => schema['@context'] === 'https://schema.org'));
  assert.ok(
    !schemas.some((schema) => ['Product', 'Offer', 'AggregateRating'].includes(schema['@type'])),
  );
  if (route !== '/') {
    const category = categories.find((item) => route === `/kataloh/${item.slug}/`);
    const { default: photos } = await import(`../app/data/galleries/${category.group}.ts`);
    for (const photo of photos) {
      const edited = editedImages[photo.src];
      assert.ok(edited, `Cleaned catalogue photo: ${photo.id}`);
      assert.ok(html.includes(`href="${base}${edited.large}"`), `Cleaned lightbox: ${photo.id}`);
      assert.ok(html.includes(`src="${base}${edited.src}"`), `Cleaned preview: ${photo.id}`);
      assert.ok(
        html.includes(`${base}${edited.large} 960w`),
        `Responsive catalogue photo: ${photo.id}`,
      );
    }
    assert.ok(html.includes(category.guide.title), `Visible category advice: ${route}`);
    assert.ok(
      html.includes('Що підготувати для обговорення'),
      `Visible selection checklist: ${route}`,
    );
  }
  if (demo) {
    assert.match(html, /name="robots" content="noindex, nofollow"/, `Demo noindex: ${route}`);
    assert.doesNotMatch(
      html,
      /href="(?:tel:|mailto:|viber:|https:\/\/(?:wa.me|t.me))/,
      `No active enquiries: ${route}`,
    );
  } else {
    assert.doesNotMatch(
      html,
      /Портфоліо-демо|Це портфоліо-демо|Звернення вимкнені в демо/,
      `Commercial content: ${route}`,
    );
    for (const phone of businessContacts.phones)
      assert.ok(html.includes(`href="tel:${phone.number}"`), `Original phone: ${route}`);
    for (const email of businessContacts.emails)
      assert.ok(html.includes(`href="mailto:${email}"`), `Original email: ${route}`);
    assert.ok(html.includes(businessContacts.address.label), `Original address: ${route}`);
    if (route === '/') {
      assert.ok(html.includes('https://wa.me/380677093312'), 'WhatsApp contact');
      assert.ok(html.includes('https://wa.me/380632692696'), 'Second WhatsApp contact');
      assert.ok(html.includes('https://www.google.com/maps/search/'), 'Map directions');
      assert.doesNotMatch(html, /<iframe/, 'Map loads only after interaction');
    }
  }
  for (const match of html.matchAll(/data-gallery-id="([^"]+)"/g)) {
    assert.ok(!galleryIds.has(match[1]), `No repeated gallery item: ${match[1]}`);
    galleryIds.add(match[1]);
  }
  if (site) {
    const canonical = new URL(route.slice(1), site).href;
    const canonicals = headLinks.filter((tag) => tag.includes('rel="canonical"'));
    assert.equal(canonicals.length, 1, `One canonical: ${route}`);
    assert.ok(canonicals[0].includes(`href="${canonical}"`), `Self-canonical: ${route}`);
    assert.deepEqual(metaValues(html, 'og:url'), [canonical], `Matching OG URL: ${route}`);
    const image = metaValues(html, 'og:image')[0];
    assert.ok(image?.startsWith(site), `Absolute site image: ${route}`);
    assert.deepEqual(metaValues(html, 'twitter:image'), [image], `Matching social image: ${route}`);
    const imagePath = decodeURIComponent(image.slice(site.length));
    const originalImage =
      route === '/'
        ? 'images/obcekt/1_12.jpg'
        : categories.find((category) => route === `/kataloh/${category.slug}/`)?.cover;
    assert.ok(originalImage, `Known social image: ${route}`);
    assert.equal(imagePath, editedImages[originalImage]?.large ?? originalImage);
    const dimensions = editedImageDimensions[imagePath] ?? assetDimensions[imagePath];
    assert.ok((await stat(resolve(output, imagePath))).isFile(), `Existing OG image: ${route}`);
    assert.deepEqual(metaValues(html, 'og:image:width'), [String(dimensions.width)]);
    assert.deepEqual(metaValues(html, 'og:image:height'), [String(dimensions.height)]);
    const page = schemas.find(
      (schema) => schema['@type'] === (route === '/' ? 'WebPage' : 'CollectionPage'),
    );
    assert.equal(page?.url, canonical, `Schema canonical: ${route}`);
    assert.equal(page?.['@id'], `${canonical}#webpage`, `Stable schema identity: ${route}`);
    assert.equal(page?.isPartOf['@id'], `${site}#website`, `Site identity: ${route}`);
    if (route === '/') {
      const website = schemas.find((schema) => schema['@type'] === 'WebSite');
      assert.equal(website?.url, site);
      assert.equal(website?.name, 'BRUKIVKA');
    } else {
      const breadcrumbs = schemas.find((schema) => schema['@type'] === 'BreadcrumbList');
      assert.equal(breadcrumbs?.['@id'], page.breadcrumb['@id']);
      assert.equal(breadcrumbs.itemListElement.at(-1).item, canonical);
      assert.deepEqual(
        breadcrumbs.itemListElement.map((item) => item.position),
        [1, 2, 3],
      );
    }
  }
  for (const match of html.matchAll(/<img\b[^>]*>/g)) {
    // The HTML minifier may serialize a valid empty decorative alt="" as bare alt.
    assert.match(match[0], /\salt(?:="[^"]*"|(?=\s|>))/, `Image alt attribute: ${route}`);
    assert.match(match[0], /\bwidth="\d+"/, `Image width: ${route}`);
    assert.match(match[0], /\bheight="\d+"/, `Image height: ${route}`);
  }
  for (const match of html.matchAll(/(?:href|src)="([^"#]+)"/g)) {
    const target = match[1].replaceAll('&amp;', '&');
    if (/^(?:https?:|mailto:|tel:|viber:|data:)/.test(target)) continue;
    const pathname = target.split(/[?#]/)[0];
    const fragment = target.includes('#') ? target.split('#')[1] : '';
    if (fragment) {
      const pagePath = resolve(output, pathname.slice(base.length), 'index.html');
      const pageHTML = await readFile(pagePath, 'utf8');
      assert.ok(pageHTML.includes(`id="${fragment}"`), `Existing anchor: ${target} in ${route}`);
    }
    assert.ok(pathname.startsWith(base), `Base-safe URL ${target} in ${route}`);
    const relative = decodeURIComponent(pathname.slice(base.length));
    const fileTarget = resolve(output, relative, pathname.endsWith('/') ? 'index.html' : '');
    assert.ok(
      fileTarget.startsWith(output + '/') || fileTarget === output,
      `Safe output path: ${target}`,
    );
    assert.ok((await stat(fileTarget)).isFile(), `Existing URL ${target} in ${route}`);
    checked++;
  }
  for (const match of html.matchAll(/srcset="([^"]+)"/g)) {
    for (const variant of match[1].split(',')) {
      const url = variant.trim().split(/\s+/)[0];
      assert.ok(url.startsWith(base), `Base-safe srcset: ${url}`);
      assert.ok(
        (await stat(resolve(output, url.slice(base.length)))).isFile(),
        `Existing srcset: ${url}`,
      );
    }
  }
}
assert.equal(galleryIds.size, 125, 'All 125 gallery entries remain accessible in rendered HTML');
assert.ok(homeHTML.includes('<details'), 'Additional galleries use native disclosure');
for (const [route, section] of Object.entries(sectionRedirects)) {
  const html = await readFile(resolve(output, `.${route}`, 'index.html'), 'utf8');
  assert.ok(html.includes(`href="${base}#${section}"`), `Old URL redirect: ${route}`);
  assert.match(html, /http-equiv="refresh"/, `No-JS redirect: ${route}`);
  assert.ok(homeHTML.includes(`id="${section}"`), `Redirect anchor exists: ${route}`);
}
const robots = await readFile(resolve(output, 'robots.txt'), 'utf8');
assert.match(robots, /Allow: \//, 'Crawlers can read both index and noindex directives');
assert.doesNotMatch(robots, /Disallow:\s*\/(?:\s|$)/, 'Do not block the HTML noindex directive');
const sitemap = await readFile(resolve(output, 'sitemap.xml'), 'utf8');
if (site) {
  for (const route of siteRoutes)
    assert.ok(
      sitemap.includes(`<loc>${new URL(route.slice(1), site).href}</loc>`),
      `Sitemap: ${route}`,
    );
  for (const route of Object.keys(sectionRedirects))
    assert.ok(
      !sitemap.includes(`<loc>${new URL(route.slice(1), site).href}</loc>`),
      `Retired URL omitted: ${route}`,
    );
  assert.equal((sitemap.match(/<loc>/g) || []).length, 7, 'Seven content URLs in sitemap');
}
const notFoundHTML = await readFile(resolve(output, '404.html'), 'utf8');
assert.deepEqual(
  metaValues(notFoundHTML, 'robots'),
  ['noindex, nofollow'],
  '404 stays noindex in every build',
);
assert.doesNotMatch(notFoundHTML, /rel="canonical"/, '404 is not canonicalized to a content page');
assert.ok((await stat(resolve(output, '.nojekyll'))).isFile());
console.log(
  `Verified ${siteRoutes.length} content routes; ${checked} local links/assets; base=${base}; canonical=${site || '(local, omitted)'}.`,
);
