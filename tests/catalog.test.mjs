import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { categories } from '../app/data/categories.ts';
import { siteRoutes } from '../config/routes.ts';

const manifest = JSON.parse(
  await readFile(new URL('../reference/legacy/asset-manifest.json', import.meta.url)),
);
const report = JSON.parse(
  await readFile(new URL('../reference/legacy/copy-report.json', import.meta.url)),
);
const source = JSON.parse(
  await readFile(new URL('../reference/asset-manifest.json', import.meta.url)),
);

test('every source gallery entry has an original legacy photo and retained caption', async () => {
  assert.equal(manifest.gallery_entries.length, source.gallery_entries.length);
  const actual = [];
  for (const group of new Set(manifest.gallery_entries.map((e) => e.group))) {
    const items = (await import(`../app/data/galleries/${group}.ts`)).default;
    for (const item of items) {
      const mapped = manifest.gallery_entries.find(
        (e) => e.group === group && e.href === item.large,
      );
      assert.ok(mapped, item.large);
      assert.equal(item.caption, mapped.snapshot_caption);
      assert.equal(item.thumbnail, mapped.thumbnail);
      assert.ok(item.width > 0 && item.height > 0);
      assert.ok(item.alt.trim(), `Meaningful gallery image alt: ${item.id}`);
      actual.push(item.large);
    }
  }
  assert.equal(actual.length, 125);
  assert.equal(new Set(actual).size, 125);
});

test('all public photo bytes match the original download report', async () => {
  assert.equal(report.copied_count, manifest.assets.length);
  for (const file of report.files) {
    const data = await readFile(new URL(`../public/${file.path}`, import.meta.url));
    assert.equal(createHash('sha256').update(data).digest('hex'), file.sha256, file.path);
  }
});

test('all category routes and counts derive from mapped groups', () => {
  assert.equal(new Set(siteRoutes).size, siteRoutes.length);
  for (const category of categories) {
    assert.ok(siteRoutes.includes(`/kataloh/${category.slug}/`));
    assert.equal(
      manifest.gallery_entries.filter((e) => e.group === category.group).length,
      category.count,
    );
  }
});

test('text and action colors meet WCAG AA contrast in both themes', async () => {
  const css = await readFile(new URL('../app/assets/styles/main.scss', import.meta.url), 'utf8');
  const themes = [...css.matchAll(/:root(?:\[data-theme='light'\])?\s*\{([^}]+)\}/g)].map((match) =>
    Object.fromEntries(
      [...match[1].matchAll(/--([\w-]+):\s*#([a-f0-9]{6})/g)].map((m) => [m[1], m[2]]),
    ),
  );
  assert.equal(themes.length, 2);
  function luminance(hex) {
    const c = hex
      .match(/\w\w/g)
      .map((v) => parseInt(v, 16) / 255)
      .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
    return c[0] * 0.2126 + c[1] * 0.7152 + c[2] * 0.0722;
  }
  function contrast(a, b) {
    const [x, y] = [luminance(a), luminance(b)].sort((a, b) => b - a);
    return (x + 0.05) / (y + 0.05);
  }
  for (const t of themes) {
    for (const color of [t.text, t.muted, t.accent])
      for (const bg of [t.bg, t.surface])
        assert.ok(contrast(color, bg) >= 4.5, `${color} on ${bg}`);
    assert.ok(contrast(t['on-accent'], t.accent) >= 4.5);
  }
});

test('compiled theme CSS keeps display rules on icons, never on the theme root', async () => {
  const { parse, compileStyle } = await import('@vue/compiler-sfc');
  const filename = fileURLToPath(new URL('../app/components/ThemeToggle.vue', import.meta.url));
  const source = await readFile(filename, 'utf8');
  const { descriptor } = parse(source);
  const result = compileStyle({
    source: descriptor.styles[0].content,
    preprocessLang: descriptor.styles[0].lang,
    filename,
    id: 'qa-theme',
    scoped: true,
  });
  assert.equal(result.errors.length, 0);
  for (const rule of result.code.matchAll(/([^{}]+)\{([^{}]+)\}/g)) {
    if (!/display:\s*(none|inline)/.test(rule[2])) continue;
    for (const selector of rule[1].split(',')) {
      assert.match(
        selector,
        /\.theme-(?:sun|moon)/,
        `Display rule must target an icon: ${selector}`,
      );
    }
  }
});
