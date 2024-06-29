import process from 'node:process'
import type { NapiResolveOptions } from 'oxc-resolver'
import { ResolverFactory } from 'oxc-resolver'

// some default options copy from https://github.com/import-js/eslint-import-resolver-typescript/blob/master/src/index.ts
const defaultOptions = {
  conditionNames: [
    'types',
    'import',
    // APF: https://angular.io/guide/angular-package-format
    'esm2020',
    'es2020',
    'es2015',

    'require',
    'node',
    'node-addons',
    'browser',
    'default',
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

    'module',
    'jsnext:main',

    'main',
  ],
  preferRelative: true,
  roots: [process.cwd()],
}

let resolver: ResolverFactory | undefined
export function resolve(
  source: string,
  file: string,
  options: NapiResolveOptions = {},
): { found: boolean, path?: string } {
  if (!resolver) {
    resolver = new ResolverFactory({
      ...defaultOptions,
      ...options,
    })
  }

  const result = resolver.sync(file, source)

  return {
    found: !!result.path,
    path: result.path,
  }
}

export const interfaceVersion = 2
