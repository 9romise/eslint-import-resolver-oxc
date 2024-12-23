import { run } from './utils'

run({
  name: 'modules',
  valid: [
    // builtin
    'path',
    'node:path',

    // external
    'vitest',
  ],
  invalid: [
    'lodash',
  ],
})

run({
  name: 'relative',
  valid: [
    '../../../.gitignore',
    '../../../package.json',
    '../../../README.md',
    '../../../.github/dependabot.yml',
    '../../../vitest.config.ts',
    '../../../vitest.config',
    '../../../src/index',
    '../../../src',
  ],
  invalid: [
    '../inexistent.ts',
  ],
})

run({
  name: 'absolute',
  valid: [
    // '.gitignore',
    'package.json',
    'README.md',
    // '.github/dependabot.yml',
    'vitest.config.ts',
    'src/index.ts',
    'src/index',
  ],
  invalid: [
    'inexistent.ts',
  ],
})
