import { resolve } from 'node:path'
import { cwd } from 'node:process'
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
    {
      source: '../../../package.json?type=1',
      path: resolve(cwd(), 'package.json'),
    },
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
    {
      source: 'package.json?type=1',
      path: resolve(cwd(), 'package.json'),
    },
  ],
  invalid: [
    'inexistent.ts',
  ],
})
