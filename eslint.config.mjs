import { createConfigForNuxt } from '@nuxt/eslint-config/flat';

export default createConfigForNuxt({ features: { stylistic: false } })
  .append({ ignores: ['reference/**', '.output/**', '.nuxt/**'] })
  .append({
    files: ['**/*.vue'],
    rules: {
      'vue/block-order': ['error', { order: ['template', 'script', 'style'] }],
      'vue/block-lang': ['error', { script: { lang: 'ts' }, style: { lang: 'scss' } }],
      'vue/padding-line-between-blocks': ['error', 'always'],
      'vue/html-self-closing': [
        'error',
        { html: { void: 'always', normal: 'always', component: 'always' } },
      ],
    },
  });
