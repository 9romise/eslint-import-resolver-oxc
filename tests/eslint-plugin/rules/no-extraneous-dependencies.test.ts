import type { NapiResolveOptions } from 'oxc-resolver'
import { oxcResolver, run, testFilePath } from '../utils'

run({
  rule: 'no-extraneous-dependencies',
  valid: [
    {
      code: `
        import "alias/esm-package/esm-module";
        import 'expose-loader?exposes[]=$&exposes[]=jQuery!jquery';
      `,
    },
    {
      code: 'import "@custom-internal-alias/api/service";',
      settings: {
        'import-x/resolver': {
          [oxcResolver]: {
            alias: {
              '@custom-internal-alias': [testFilePath('internal-modules')],
            },
          } satisfies NapiResolveOptions,
        },
      },
    },
  ],
  invalid: [
    {
      code: 'import jest from "alias/jest";',
      settings: {
        'import-x/resolver': {
          [oxcResolver]: {
            alias: {
              'alias/jest': ['jest'],
            },
          } satisfies NapiResolveOptions,
        },
      },
      errors: [
      // missing dependency is jest not alias
        { messageId: 'missing', data: { packageName: 'jest' } },
      ],
    },
  ],
})

const packageDirWithTypescriptDevDependencies = testFilePath('with-typescript-dev-dependencies')

run({
  rule: 'no-extraneous-dependencies',
  lang: 'ts',
  valid: [
    {
      code: 'import type T from "a";',
      options: [
        {
          packageDir: packageDirWithTypescriptDevDependencies,
          devDependencies: false,
        },
      ],
    },
    {
      code: 'import type { T } from "a"; export type { T };',
      options: [
        {
          packageDir: packageDirWithTypescriptDevDependencies,
          devDependencies: false,
        },
      ],
    },
    {
      code: 'export type { T } from "a";',
      options: [
        {
          packageDir: packageDirWithTypescriptDevDependencies,
          devDependencies: false,
        },
      ],
    },
  ],
  invalid: [
    {
      code: 'import T from "a";',
      options: [
        {
          packageDir: packageDirWithTypescriptDevDependencies,
          devDependencies: false,
        },
      ],
      errors: [{ messageId: 'devDep', data: { packageName: 'a' } }],
    },
    {
      code: 'import type T from "a";',
      options: [
        {
          packageDir: packageDirWithTypescriptDevDependencies,
          devDependencies: false,
          includeTypes: true,
        },
      ],
      errors: [{ messageId: 'devDep', data: { packageName: 'a' } }],
    },
  ],
})
