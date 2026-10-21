import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { compile, parse } from '@vue/compiler-dom';
import { parse as parseSfc } from '@vue/compiler-sfc';
import * as Vue from 'vue';
import { renderToString } from 'vue/server-renderer';
import { renderNoJsNavigation } from '../app/utils/noJsNavigation.ts';
import { sectionNavigation } from '../app/data/navigation.ts';

const source = await readFile(new URL('../app/components/AppHeader.vue', import.meta.url), 'utf8');
const { descriptor } = parseSfc(source);
const noscript = parse(descriptor.template.content).children.find(
  (node) => node.tag === 'noscript',
);
assert.ok(noscript, 'The no-JS navigation fallback is retained');
const { code } = compile(noscript.loc.source, { mode: 'function', prefixIdentifiers: true });
const render = new Function('Vue', code)(Vue);

test('header noscript retains real links without creating hydratable child VNodes', async () => {
  for (const base of ['/', '/brukivka/']) {
    let vnode;
    const warnings = [];
    const html = renderNoJsNavigation(base);
    const app = Vue.createSSRApp({
      components: {
        NuxtLink: {
          props: ['to'],
          setup:
            (props, { slots }) =>
            () =>
              Vue.h('a', { href: props.to }, slots.default?.()),
        },
      },
      setup: () => ({
        noJsNavigation: html,
        nav: sectionNavigation.map(({ id, label }) => ({ to: `/#${id}`, label })),
        route: { path: '/', hash: '' },
      }),
      render() {
        vnode = render(this, []);
        return vnode;
      },
    });
    app.config.warnHandler = (message) => warnings.push(message);
    const serverHTML = await renderToString(app);
    assert.deepEqual(warnings, []);
    assert.equal(vnode.type, 'noscript');
    // Scripting-enabled HTML parsers expose the server contents as a text node.
    // A child VNode tree here would make Vue expect <nav> and reproduce the reported mismatch.
    assert.equal(vnode.children, null);
    assert.equal(vnode.props.innerHTML, html);
    assert.ok(serverHTML.includes(html), 'No-JS HTML remains rendered on the server');
    for (const { id, label } of sectionNavigation) {
      assert.ok(serverHTML.includes(`href="${base}#${id}"`));
      assert.ok(serverHTML.includes(label));
    }
  }
});

test('no-JS navigation escapes HTML attribute characters in the deployment base path', () => {
  const html = renderNoJsNavigation('/a&"<>\'/');
  assert.ok(html.includes('/a&amp;&quot;&lt;&gt;&#39;/#kataloh'));
  assert.doesNotMatch(html, /href="\/a&"/);
});
