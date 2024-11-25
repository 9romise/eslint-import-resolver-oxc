import { run } from '../utils'

run({
  rule: 'no-rename-default',
  lang: 'ts',
  valid: [
    {
      code: `import foo from './no-rename-default/typescript-default'`,
    },
  ],
  invalid: [],
})
