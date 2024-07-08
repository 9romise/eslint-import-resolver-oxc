import fs from 'node:fs'
import path from 'node:path'
import { cwd } from 'node:process'
import type { NapiResolveOptions } from 'oxc-resolver'

// @keep-sorted
/**
 * some default options copy from
 * https://github.com/import-js/eslint-import-resolver-typescript/blob/master/src/index.ts
 * https://github.com/rolldown/rolldown/blob/main/crates/rolldown_resolver/src/resolver.rs
 */
const defaultOptions: NapiResolveOptions = {
  aliasFields: [
    ['browser'],
  ],
  conditionNames: [
    'default',
    'types',

    'import',
    'require',

    'node',
    'node-addons',
    'browser',

    // APF: https://angular.io/guide/angular-package-format
    'esm2020',
    'es2020',
    'es2015',
  ],
  extensionAlias: {
    '.js': [
      '.ts',
      // `.tsx` can also be compiled as `.js`
      '.tsx',
      '.d.ts',
      '.js',
    ],
    '.jsx': ['.tsx', '.d.ts', '.jsx'],
    '.cjs': ['.cts', '.d.cts', '.cjs'],
    '.mjs': ['.mts', '.d.mts', '.mjs'],
  },
  extensions: [
    '.ts',
    '.tsx',
    '.d.ts',
    '.js',
    '.jsx',
    '.json',
    '.node',
  ],
  mainFields: [
    'types',
    'typings',

    // APF: https://angular.io/guide/angular-package-format
    'fesm2020',
    'fesm2015',
    'esm2020',
    'es2020',

    'main',
    'module',
    'browser',
    'jsnext:main',
  ],
  roots: [cwd()],
}

export function normalizeOptions(options: NapiResolveOptions | null = {}): NapiResolveOptions {
  if (!options?.tsconfig) {
    const configFile = path.resolve(cwd(), './tsconfig.json')
    if (fs.existsSync(configFile)) {
      defaultOptions.tsconfig = {
        configFile,
        references: 'auto',
      }
    }
  }
  return {
    ...defaultOptions,
    ...options,
  }
}
