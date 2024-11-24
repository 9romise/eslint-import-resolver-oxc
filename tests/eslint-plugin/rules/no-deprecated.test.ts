import { run } from '../utils'

run({
  rule: 'no-deprecated',
  lang: 'ts',
  valid: [
    'import * as hasDeprecated from \'./ts-deprecated.ts\'',
  ],
  invalid: [
    {
      code: 'import { foo } from \'./ts-deprecated.ts\'; console.log(foo())',
      errors: [
        { type: 'ImportSpecifier', message: 'Deprecated: don\'t use this!' },
        { type: 'Identifier', message: 'Deprecated: don\'t use this!' },
      ],
    },
  ],
})
