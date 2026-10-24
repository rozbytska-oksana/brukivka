import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { editedImages, editedImageDimensions, withEditedImage } from '../app/data/edited-images.ts';
import { categories } from '../app/data/categories.ts';
import projects from '../app/data/galleries/objects.ts';
import warehouse from '../app/data/galleries/cat-7.ts';
import stones from '../app/data/galleries/stones.ts';

const categoryItems = (
  await Promise.all(
    categories.map((category) => import(`../app/data/galleries/${category.group}.ts`)),
  )
).flatMap((gallery) => gallery.default);

function jpegDimensions(buffer) {
  assert.equal(buffer.readUInt16BE(0), 0xffd8);
  let offset = 2;
  while (offset + 9 < buffer.length) {
    const marker = buffer.readUInt16BE(offset);
    const length = buffer.readUInt16BE(offset + 2);
    if ([0xffc0, 0xffc1, 0xffc2].includes(marker)) {
      return { width: buffer.readUInt16BE(offset + 7), height: buffer.readUInt16BE(offset + 5) };
    }
    offset += 2 + length;
  }
  throw new Error('JPEG dimensions not found');
}

test('edited photos have accurate dimensions and bounded preview/full-size bytes', async () => {
  const variantHashes = new Set();
  const report = JSON.parse(
    await readFile(new URL('../reference/legacy/copy-report.json', import.meta.url)),
  );
  for (const [original, image] of Object.entries(editedImages)) {
    assert.ok(image);
    const originalBytes = await readFile(new URL(`../public/${original}`, import.meta.url));
    assert.equal(
      createHash('sha256').update(originalBytes).digest('hex'),
      report.files.find((file) => file.path === original)?.sha256,
      `Unchanged original: ${original}`,
    );
    assert.deepEqual(
      image.variants.map((variant) => variant.width),
      [480, 960],
    );
    assert.equal(image.src, image.variants[0].src);
    assert.equal(image.large, image.variants[1].src);
    for (const variant of image.variants) {
      const bytes = await readFile(new URL(`../public/${variant.src}`, import.meta.url));
      const hash = createHash('sha256').update(bytes).digest('hex');
      assert.ok(!variantHashes.has(hash), `No duplicate exported photo: ${variant.src}`);
      variantHashes.add(hash);
      assert.ok(bytes.length <= (variant.width === 480 ? 50 : 130) * 1024, variant.src);
      const dimensions = { width: variant.width, height: variant.height };
      assert.deepEqual(jpegDimensions(bytes), dimensions, variant.src);
      assert.deepEqual(editedImageDimensions[variant.src], dimensions, variant.src);
    }
  }
});

test('photo replacements cover the requested blocks and leave stone samples unchanged', async () => {
  const expected = [
    ...categoryItems.map((image) => image.src),
    ...projects.map((image) => image.src),
    ...warehouse.map((image) => image.src),
  ];
  assert.deepEqual(Object.keys(editedImages).sort(), [...new Set(expected)].sort());
  for (const original of [...categoryItems, ...projects, ...warehouse]) {
    const before = structuredClone(original);
    const edited = withEditedImage(original);
    assert.equal(edited.id, original.id);
    assert.equal(edited.caption, original.caption);
    assert.equal(edited.alt, original.alt);
    assert.equal(edited.large, editedImages[original.src].large);
    assert.deepEqual(original, before);
  }
  for (const stone of stones) assert.equal(withEditedImage(stone), stone);
  assert.equal(categoryItems.length, 87);
  const expectedFiles = new Set([
    ...Object.values(editedImages).flatMap((image) =>
      image.variants.map((variant) => variant.src.split('/').at(-1)),
    ),
    'material-story-600.jpg',
    'material-story-1200.jpg',
    'service-delivery-600.jpg',
    'service-delivery-1200.jpg',
    'service-installation-600.jpg',
    'service-installation-1200.jpg',
  ]);
  assert.deepEqual(
    (await readdir(new URL('../public/images/edited/', import.meta.url))).sort(),
    [...expectedFiles].sort(),
    'Only referenced image variants belong in the edited assets directory',
  );
  const visibleSources = [
    ...categories.map((category) => category.cover),
    ...[projects[11], projects[12], projects[4]].map((image) => image.src),
    warehouse[0].src,
  ];
  const previewBytes = await Promise.all(
    visibleSources.map(
      async (source) =>
        (await readFile(new URL(`../public/${editedImages[source].src}`, import.meta.url))).length,
    ),
  );
  assert.ok(previewBytes.reduce((sum, bytes) => sum + bytes, 0) <= 400 * 1024);
  const originalBytes = await Promise.all(
    visibleSources.map(
      async (source) => (await readFile(new URL(`../public/${source}`, import.meta.url))).length,
    ),
  );
  const largeBytes = await Promise.all(
    visibleSources.map(
      async (source) =>
        (await readFile(new URL(`../public/${editedImages[source].large}`, import.meta.url)))
          .length,
    ),
  );
  assert.ok(
    largeBytes.reduce((sum, bytes) => sum + bytes, 0) <=
      originalBytes.reduce((sum, bytes) => sum + bytes, 0),
    'Even the largest candidates must not exceed the original visible-image byte total',
  );
});
