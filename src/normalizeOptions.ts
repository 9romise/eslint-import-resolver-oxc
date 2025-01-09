import type { OxcResolverOptions } from './typings'
import { cwd } from 'node:process'
import { isPlainObject, mergeWith } from 'es-toolkit'
import { detectFile } from './utils'

// @keep-sorted
/**
 * some default options copy from
 * https://github.com/import-js/eslint-import-resolver-typescript/blob/master/src/index.ts
 * https://github.com/rolldown/rolldown/blob/main/crates/rolldown_resolver/src/resolver.rs
 */
const defaultOptions: OxcResolverOptions = {
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

export function mergeOptions(a?: OxcResolverOptions | null, b?: OxcResolverOptions | null): OxcResolverOptions {
  a ??= {}
  b ??= {}

  function mergeFunc(objVal: any, srcVal: any) {
    if (Array.isArray(objVal) || Array.isArray(srcVal)) {
      return objVal.concat(srcVal)
    } else if (isPlainObject(objVal) && isPlainObject(srcVal)) {
      return mergeWith(objVal, srcVal, mergeFunc)
    }
  }
  return mergeWith(a, b, mergeFunc)
}

export function normalizeOptions(options: OxcResolverOptions = {}): OxcResolverOptions {
  if (!options?.tsconfig) {
    const configFile = detectFile(['tsconfig.json', 'jsconfig.json'])
    if (configFile) {
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
