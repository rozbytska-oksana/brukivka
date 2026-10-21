import assert from 'node:assert/strict';

assert.equal(
  process.env.BRUKIVKA_TARGET || 'production',
  'production',
  'Release must use production',
);
assert.equal(
  process.env.BRUKIVKA_ALLOW_INDEXING,
  'true',
  'Run release verification with BRUKIVKA_ALLOW_INDEXING=true after generating the same build',
);

await import('./verify-output.mjs');
console.log('Indexable production HTML verified locally. This command does not publish the site.');
