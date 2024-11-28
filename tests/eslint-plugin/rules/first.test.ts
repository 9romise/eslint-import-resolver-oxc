import { run } from '../utils'

run({
  rule: 'first',
  lang: 'ts',
  valid: [
    {
      code: `
        import y = require('bar');
        import { x } from 'foo';
        import z = require('baz');
      `,
    },
  ],
  invalid: [
    {
      code: `
        import { x } from './foo';
        import y = require('bar');
      `,
      options: ['absolute-first'],
      errors: [
        {
          message: 'Absolute imports should come before relative imports.',
        },
      ],
    },
  ],
})
