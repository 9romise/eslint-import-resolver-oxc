import { resolve } from 'node:path'
import { run } from './utils'

await run({
  name: 'vite',
  options: {
    bundlerConfig: {
      type: 'vite',
      path: resolve(import.meta.dirname, './fixtures/vite.config.ts'),
    },
  },
  valid: [
    '#test/a',
  ],
  invalid: [],
})
