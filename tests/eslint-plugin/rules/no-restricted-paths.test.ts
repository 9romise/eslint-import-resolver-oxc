import { run, testFilePath } from '../utils'

function createZoneError(importPath: string, extra: string = '') {
  return { messageId: 'zone', data: { importPath, extra } }
}

run({
  rule: 'no-restricted-paths',
  lang: 'ts',
  valid: [

    {
      code: 'import type a from "../client/a.ts"',
      filename: testFilePath('./restricted-paths/server/b.ts'),
      options: [
        {
          zones: [
            {
              target: './tests/eslint-plugin/fixtures/restricted-paths/server',
              from: './tests/eslint-plugin/fixtures/restricted-paths/other',
            },
          ],
        },
      ],
    },
    {
      code: 'import type a from "../client/a.ts"',
      filename: testFilePath('./restricted-paths/server/b.ts'),
      options: [
        {
          zones: [
            {
              target: '**/*',
              from: './tests/eslint-plugin/fixtures/restricted-paths/other',
            },
          ],
        },
      ],

    },
    {
      code: 'import type a from "../client/a.ts"',
      filename: testFilePath('./restricted-paths/client/b.ts'),
      options: [
        {
          zones: [
            {
              target: './tests/eslint-plugin/fixtures/restricted-paths/!(client)/**/*',
              from: './tests/eslint-plugin/fixtures/restricted-paths/client/**/*',
            },
          ],
        },
      ],
    },
    {
      code: 'import type b from "../server/b.ts"',
      filename: testFilePath('./restricted-paths/client/a.ts'),
      options: [
        {
          zones: [
            {
              target: './tests/eslint-plugin/fixtures/restricted-paths/client',
              from: './tests/eslint-plugin/fixtures/restricted-paths/other',
            },
          ],
        },
      ],

    },
    {
      code: 'import type a from "./a.ts"',
      filename: testFilePath('./restricted-paths/server/one/a.ts'),
      options: [
        {
          zones: [
            {
              target: './tests/eslint-plugin/fixtures/restricted-paths/server/one',
              from: './tests/eslint-plugin/fixtures/restricted-paths/server',
              except: ['./one'],
            },
          ],
        },
      ],
    },
    {
      code: 'import type a from "../two/a.ts"',
      filename: testFilePath('./restricted-paths/server/one/a.ts'),
      options: [
        {
          zones: [
            {
              target: './tests/eslint-plugin/fixtures/restricted-paths/server/one',
              from: './tests/eslint-plugin/fixtures/restricted-paths/server',
              except: ['./two'],
            },
          ],
        },
      ],
    },
    {
      code: 'import type a from "../one/a.ts"',
      filename: testFilePath('./restricted-paths/server/two-new/a.ts'),
      options: [
        {
          zones: [
            {
              target: './tests/eslint-plugin/fixtures/restricted-paths/server/two',
              from: './tests/eslint-plugin/fixtures/restricted-paths/server',
              except: [],
            },
          ],
        },
      ],
    },
    {
      code: 'import type A from "../two/a.ts"',
      filename: testFilePath('./restricted-paths/server/one/a.ts'),
      options: [
        {
          zones: [
            {
              target: '**/*',
              from: './tests/eslint-plugin/fixtures/restricted-paths/server/**/*',
              except: ['**/a.js'],
            },
          ],
        },
      ],
    },
    // no config
    {
      code: 'import type b from "../server/b.js"',
    },
    {
      code: 'import type * as b from "../server/b.js"',
    },
  ],
  invalid: [
    {
      code: 'import type b from "../server/b"',
      filename: testFilePath('./restricted-paths/client/a.ts'),
      options: [
        {
          zones: [
            {
              target: './tests/eslint-plugin/fixtures/restricted-paths/client',
              from: './tests/eslint-plugin/fixtures/restricted-paths/server',
            },
          ],
        },
      ],
      errors: [
        {
          ...createZoneError('../server/b'),
          line: 1,
          column: 20,
        },
      ],
    },
    {
      code: 'import type b from "../server/b"',
      filename: testFilePath('./restricted-paths/client/a.ts'),
      options: [
        {
          zones: [
            {
              target: './tests/eslint-plugin/fixtures/restricted-paths/client/**/*',
              from: './tests/eslint-plugin/fixtures/restricted-paths/server',
            },
          ],
        },
      ],
      errors: [
        {
          ...createZoneError('../server/b'),
          line: 1,
          column: 20,
        },
      ],
    },
    {
      code: 'import type a from "../client/a"\nimport type c from "./c.ts"',
      filename: testFilePath('./restricted-paths/server/b.ts'),
      options: [
        {
          zones: [
            {
              target: './tests/eslint-plugin/fixtures/restricted-paths/server',
              from: [
                './tests/eslint-plugin/fixtures/restricted-paths/client',
                './tests/eslint-plugin/fixtures/restricted-paths/server/c.ts',
              ],
            },
          ],
        },
      ],
      errors: [
        {
          ...createZoneError('../client/a'),
          line: 1,
          column: 20,
        },
        {
          ...createZoneError('./c.ts'),
          line: 2,
          column: 20,
        },
      ],
    },
    {
      code: 'import type b from "../server/b"',
      filename: testFilePath('./restricted-paths/client/a'),
      options: [
        {
          zones: [{ target: './client', from: './server' }],
          basePath: testFilePath('./restricted-paths'),
        },
      ],
      errors: [
        {
          ...createZoneError('../server/b'),
          line: 1,
          column: 20,
        },
      ],
    },
    {
      code: 'import type b from "../two/a"',
      filename: testFilePath('./restricted-paths/server/one/a.ts'),
      options: [
        {
          zones: [
            {
              target: './tests/eslint-plugin/fixtures/restricted-paths/server/one',
              from: './tests/eslint-plugin/fixtures/restricted-paths/server',
              except: ['./one'],
            },
          ],
        },
      ],
      errors: [
        {
          ...createZoneError('../two/a'),
          line: 1,
          column: 20,
        },
      ],
    },
    {
      code: 'import type b from "../two/a"',
      filename: testFilePath('./restricted-paths/server/one/a'),
      options: [
        {
          zones: [
            {
              target: './tests/eslint-plugin/fixtures/restricted-paths/server/one',
              from: './tests/eslint-plugin/fixtures/restricted-paths/server',
              except: ['./one'],
              message: 'Custom message',
            },
          ],
        },
      ],
      errors: [
        {
          ...createZoneError('../two/a', ' Custom message'),
          line: 1,
          column: 20,
        },
      ],
    },
    {
      code: 'import type b from "../two/a"',
      filename: testFilePath('./restricted-paths/server/one/a.ts'),
      options: [
        {
          zones: [
            {
              target: './tests/eslint-plugin/fixtures/restricted-paths/server/one',
              from: './tests/eslint-plugin/fixtures/restricted-paths/server',
              except: ['../client/a'],
            },
          ],
        },
      ],
      errors: [{ messageId: 'path', line: 1, column: 20 }],
    },
    {
      code: 'import type A from "../two/a"',
      filename: testFilePath('./restricted-paths/server/one/a.ts'),
      options: [
        {
          zones: [
            {
              target: '**/*',
              from: './tests/eslint-plugin/fixtures/restricted-paths/server/**/*',
            },
          ],
        },
      ],
      errors: [
        {
          ...createZoneError('../two/a'),
          line: 1,
          column: 20,
        },
      ],
    },
    {
      code: 'import type A from "../two/a"',
      filename: testFilePath('./restricted-paths/server/one/a.ts'),
      options: [
        {
          zones: [
            {
              target: '**/*',
              from: './tests/eslint-plugin/fixtures/restricted-paths/server/**/*',
              except: ['a.ts'],
            },
          ],
        },
      ],
      errors: [{ messageId: 'glob', line: 1, column: 20 }],
    },
  ],
})
