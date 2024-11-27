import { run } from '../utils'

run({
  rule: 'extensions',
  invalid: [
    {
      code: `
      import _ from 'lodash';
      import m from '@test-scope/some-module/index.js';

      import bar from './bar';
    `,
      options: ['never'],
      settings: {
        'import-x/external-module-folders': [
          'node_modules',
          'symlinked-module',
        ],
      },
      errors: [
        {
          messageId: 'unexpected',
          data: {
            extension: 'js',
            importPath: '@test-scope/some-module/index.js',
          },
          line: 3,
        },
      ],
    },
  ],
})
