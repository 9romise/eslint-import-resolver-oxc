import type { NapiResolveOptions } from 'oxc-resolver'
import { run, testFilePath } from '../utils'

run({
  rule: 'no-internal-modules',
  invalid: [
    {
      code: 'import "@/api/service";',
      options: [
        {
          forbid: ['**/api/*'],
        },
      ],
      errors: [
        {
          message: 'Reaching to "@/api/service" is not allowed.',
          line: 1,
          column: 8,
        },
      ],
      settings: {
        'import-x/resolver': {
          oxc: {
            alias: {
              '@': [testFilePath('internal-modules')],
            },
          } satisfies NapiResolveOptions,
        },
      },
    },
  ],
})
