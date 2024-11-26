import { run } from '../utils'

run({
  rule: 'no-cycle',
  defaultFilenames: {
    js: 'tests/eslint-plugin/fixtures/cycles/depth-zero.js',
    ts: 'tests/eslint-plugin/fixtures/cycles/depth-zero.js',
  },
  valid: [
    {
      code: 'import { foo } from "cycles/external/depth-one"',
      options: [{ ignoreExternal: true }],
      settings: {
        'import-x/external-module-folders': ['cycles/external'],
      },
    },
    {
      code: 'import { foo } from "./external-depth-two"',
      options: [{ ignoreExternal: true }],
      settings: {
        'import-x/external-module-folders': ['cycles/external'],
      },
    },
  ],
  invalid: [
    {
      code: 'import { foo } from "cycles/external/depth-one"',
      errors: [{ message: `Dependency cycle detected.` }],
      settings: {
        'import-x/external-module-folders': ['cycles/external'],
      },
    },
    {
      code: 'import { foo } from "./external-depth-two"',
      errors: [{ message: `Dependency cycle via cycles/external/depth-one:1` }],
      settings: {
        'import-x/external-module-folders': ['cycles/external'],
      },
    },
  ],
})
