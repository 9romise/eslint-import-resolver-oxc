import { run } from '../utils'

run({
  rule: 'no-named-as-default',
  lang: 'ts',
  valid: [
    {
      code: `/** TypeScript */ import klawSync from "klaw-sync";`,
      settings: {
        'import-x/extensions': [
          '.ts',
          '.cts',
          '.mts',
          '.tsx',
          '.js',
          '.cjs',
          '.mjs',
          '.jsx',
        ],
        'import-x/external-module-folders': [
          'node_modules',
          'node_modules/@types',
        ],
      },
    },
  ],
})
