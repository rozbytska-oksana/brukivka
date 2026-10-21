import test from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { compile, compileString } from 'sass';
import { parse as parseVue } from '@vue/compiler-sfc';
import postcss from 'postcss';

const app = new URL('../app/', import.meta.url);
const styles = new Map();
styles.set(
  'global',
  postcss.parse(compile(fileURLToPath(new URL('assets/styles/main.scss', app))).css),
);

// Compile every authored SFC stylesheet, including relative @use imports.
for (const entry of await readdir(app, { recursive: true })) {
  if (!entry.endsWith('.vue')) continue;
  const url = new URL(entry, app);
  const { descriptor } = parseVue(await readFile(url, 'utf8'));
  for (const style of descriptor.styles) {
    styles.set(entry, postcss.parse(compileString(style.content, { url }).css));
  }
}

test('all compiled width queries are mobile-first and share the two agreed breakpoints', () => {
  const widths = new Set();
  for (const [file, css] of styles) {
    css.walkAtRules('media', (rule) => {
      if (!/width/.test(rule.params)) return;
      assert.match(rule.params, /^\(min-width: (768|1200)px\)$/, `${file}: ${rule.params}`);
      widths.add(rule.params);
    });
  }
  assert.equal(widths.size, 2);
});

// Resolve the selected layout rules at breakpoint boundaries, without claiming browser layout QA.
function layout(file, selectors, width, property) {
  let value;
  styles.get(file).walkRules((rule) => {
    if (!rule.selectors.some((selector) => selectors.includes(selector))) return;
    for (let parent = rule.parent; parent; parent = parent.parent) {
      if (parent.type !== 'atrule') continue;
      if (parent.name !== 'media') return;
      const match = parent.params.match(/^\(min-width: (\d+)px\)$/);
      if (!match || width < Number(match[1])) return;
    }
    rule.walkDecls(property, (declaration) => {
      value = declaration.value;
    });
  });
  return value;
}

test('navigation and gallery layouts switch at 768 and 1200 without a gap', () => {
  for (const width of [320, 767, 768, 1199, 1200, 1920]) {
    const desktop = width >= 1200;
    const columns = desktop ? 3 : width >= 768 ? 2 : 1;
    const expectedGrid = columns === 1 ? 'minmax(0, 1fr)' : `repeat(${columns}, minmax(0, 1fr))`;
    assert.equal(
      layout('global', ['.category-grid'], width, 'grid-template-columns'),
      expectedGrid,
    );
    assert.equal(
      layout('components/ImageGallery.vue', ['.gallery-grid'], width, 'grid-template-columns'),
      expectedGrid,
    );
    assert.equal(
      layout('components/AppHeader.vue', ['.desktop-nav'], width, 'display'),
      desktop ? 'flex' : 'none',
    );
    assert.equal(
      layout('components/AppHeader.vue', ['.header-phone'], width, 'display'),
      desktop ? 'inline-flex' : 'none',
    );
    assert.equal(
      layout('components/AppHeader.vue', ['.menu-trigger'], width, 'display'),
      desktop ? 'none' : 'inline-grid',
    );
    assert.equal(layout('global', [':root'], width, '--header-height'), desktop ? '88px' : '74px');
    const stones = desktop ? 6 : width >= 768 ? 3 : 2;
    assert.equal(
      layout(
        'components/ImageGallery.vue',
        ['.gallery-grid', '.gallery-stones .gallery-grid'],
        width,
        'grid-template-columns',
      ),
      `repeat(${stones}, minmax(0, 1fr))`,
    );
  }
});
