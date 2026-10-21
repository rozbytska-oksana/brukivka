import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
const kind = process.argv[2];
const bins = kind === 'typecheck' ? ['nuxt', 'vue-tsc', 'tsc'] : ['eslint', 'prettier'];
for (const bin of bins) {
  if (!existsSync(`node_modules/.bin/${bin}`)) {
    console.error(`Missing local ${bin}. Run npm install to restore the declared dependencies.`);
    process.exit(1);
  }
}
const result =
  kind === 'typecheck'
    ? spawnSync('node_modules/.bin/nuxt', ['typecheck'], { stdio: 'inherit' })
    : spawnSync('node_modules/.bin/eslint', ['.'], { stdio: 'inherit' });
if (result.status !== 0) process.exit(result.status ?? 1);
if (kind === 'lint') {
  const formatting = spawnSync('node_modules/.bin/prettier', ['--check', '.', '--ignore-unknown'], {
    stdio: 'inherit',
  });
  process.exit(formatting.status ?? 1);
}
