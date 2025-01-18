import { resolve } from 'node:path'
import { run } from '../utils'

const CONFIG_PATH = resolve(import.meta.dirname, '../fixtures/vite.config.ts')

await run({
  name: 'normal',
  options: {
    bundlerConfig: {
      type: 'vite',
      path: CONFIG_PATH,
    },
  },
  valid: [
    '#test/a',
  ],
  invalid: [],
})
