import test from 'node:test';
import assert from 'node:assert/strict';
import { readdir, stat } from 'node:fs/promises';
import { heroImages } from '../app/data/hero-images.ts';

test('hero responsive exports are all referenced and reduce the mobile image budget', async () => {
  const files = await readdir('public/images/hero');
  assert.equal(heroImages.length, 8);
  assert.deepEqual(files.sort(), heroImages.map((image) => image.src.split('/').at(-1)).sort());
  let previews = 0;
  let originals = 0;
  for (const image of heroImages) {
    assert.equal(image.variants[0].width, 400);
    assert.equal(image.variants[0].src, image.src);
    assert.equal(image.variants[1].width, image.width);
    previews += (await stat(`public/${image.src}`)).size;
    originals += (await stat(`public/${image.variants[1].src}`)).size;
  }
  assert.ok(previews < originals * 0.5, 'Mobile previews must save at least half the bytes');
});
