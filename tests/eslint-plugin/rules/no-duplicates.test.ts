import { run } from '../utils'

function createDuplicatedError(module: string) {
  return {
    messageId: 'duplicate',
    data: { module },
  }
}

run({
  rule: 'no-duplicates',
  lang: 'ts',
  valid: [
    // #1667: ignore duplicate if is a typescript type import
    {
      code: 'import type { x } from \'./foo\'; import y from \'./foo\'',
    },
    {
      code: 'import type { x } from \'./foo\'; import type * as y from \'./foo\'',
    },
    {
      code: 'import type x from \'./foo\'; import type y from \'./bar\'',
    },
    {
      code: 'import type {x} from \'./foo\'; import type {y} from \'./bar\'',
    },
    {
      code: 'import type x from \'./foo\'; import type {y} from \'./foo\'',
    },
    {
      code: `
        import type {} from './module';
        import {} from './module2';
      `,
    },
    {
      code: `
        import type { Identifier } from 'module';

        declare module 'module2' {
          import type { Identifier } from 'module';
        }

        declare module 'module3' {
          import type { Identifier } from 'module';
        }
      `,
    },
    // #2470: ignore duplicate if is a typescript inline type import
    {
      code: 'import { type x } from \'./foo\'; import y from \'./foo\'',
    },
    {
      code: 'import { type x } from \'./foo\'; import { y } from \'./foo\'',
    },
    {
      code: 'import { type x } from \'./foo\'; import type y from \'foo\'',
    },
    {
      code: 'import type { A } from \'foo\';import type B from \'foo\';',
      options: [{ 'prefer-inline': true }],
    },
    {
      code: 'import { type A } from \'foo\';import type B from \'foo\';',
      options: [{ 'prefer-inline': true }],
    },
    {
      code: 'import type A from \'foo\';import { B } from \'foo\';',
      options: [{ 'prefer-inline': true }],
    },
  ],
  invalid: [
    {
      code: 'import type x from \'./foo\'; import type y from \'./foo\'',
      errors: [
        {
          ...createDuplicatedError('./foo'),
          line: 1,
          column: 20,
        },
        {
          ...createDuplicatedError('./foo'),
          line: 1,
          column: 48,
        },
      ],
    },
    {
      code: 'import type x from \'./foo\'; import type x from \'./foo\'',
      output: 'import type x from \'./foo\'; ',
      errors: [
        {
          ...createDuplicatedError('./foo'),
          line: 1,
          column: 20,
        },
        {
          ...createDuplicatedError('./foo'),
          line: 1,
          column: 48,
        },
      ],
    },
    {
      code: 'import type {x} from \'./foo\'; import type {y} from \'./foo\'',
      output: `import type {x,y} from './foo'; `,
      errors: [
        {
          ...createDuplicatedError('./foo'),
          line: 1,
          column: 22,
        },
        {
          ...createDuplicatedError('./foo'),
          line: 1,
          column: 52,
        },
      ],
    },
    {
      code: 'import {type x} from \'./foo\'; import type {y} from \'./foo\'',
      options: [{ 'prefer-inline': false }],
      output: `import {type x,y} from './foo'; `,
      errors: [
        {
          ...createDuplicatedError('./foo'),
          line: 1,
          column: 22,
        },
        {
          ...createDuplicatedError('./foo'),
          line: 1,
          column: 52,
        },
      ],
    },
    {
      code: 'import type {x} from \'foo\'; import {type y} from \'foo\'',
      options: [{ 'prefer-inline': true }],
      output: `import {type x,type y} from 'foo'; `,
      errors: [
        {
          ...createDuplicatedError('foo'),
          line: 1,
          column: 22,
        },
        {
          ...createDuplicatedError('foo'),
          line: 1,
          column: 50,
        },
      ],
    },
    {
      code: 'import {type x} from \'foo\'; import type {y} from \'foo\'',
      options: [{ 'prefer-inline': true }],
      output: `import {type x,type y} from 'foo'; `,
      errors: [
        {
          ...createDuplicatedError('foo'),
          line: 1,
          column: 22,
        },
        {
          ...createDuplicatedError('foo'),
          line: 1,
          column: 50,
        },
      ],
    },
    {
      code: 'import {type x} from \'foo\'; import type {y} from \'foo\'',
      output: `import {type x,y} from 'foo'; `,
      errors: [
        {
          ...createDuplicatedError('foo'),
          line: 1,
          column: 22,
        },
        {
          ...createDuplicatedError('foo'),
          line: 1,
          column: 50,
        },
      ],
    },
    {
      code: 'import {type x} from \'./foo\'; import {type y} from \'./foo\'',
      options: [{ 'prefer-inline': true }],
      output: `import {type x,type y} from './foo'; `,
      errors: [
        {
          ...createDuplicatedError('./foo'),
          line: 1,
          column: 22,
        },
        {
          ...createDuplicatedError('./foo'),
          line: 1,
          column: 52,
        },
      ],
    },
    {
      code: 'import {type x} from \'./foo\'; import {type y} from \'./foo\'',
      output: `import {type x,type y} from './foo'; `,
      errors: [
        {
          ...createDuplicatedError('./foo'),
          line: 1,
          column: 22,
        },
        {
          ...createDuplicatedError('./foo'),
          line: 1,
          column: 52,
        },
      ],
    },
    {
      code: 'import {AValue, type x, BValue} from \'./foo\'; import {type y} from \'./foo\'',
      output: `import {AValue, type x, BValue,type y} from './foo'; `,
      errors: [
        {
          ...createDuplicatedError('./foo'),
          line: 1,
          column: 38,
        },
        {
          ...createDuplicatedError('./foo'),
          line: 1,
          column: 68,
        },
      ],
    },
    // #2834 Detect duplicates across type and regular imports
    {
      code: 'import {AValue} from \'./foo\'; import type {AType} from \'./foo\'',
      options: [{ 'prefer-inline': true }],
      output: `import {AValue,type AType} from './foo'; `,
      errors: [
        {
          ...createDuplicatedError('./foo'),
          line: 1,
          column: 22,
        },
        {
          ...createDuplicatedError('./foo'),
          line: 1,
          column: 56,
        },
      ],
    },
  ],
})
