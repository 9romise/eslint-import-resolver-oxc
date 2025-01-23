import { resolve } from 'node:path'
import { run } from '../utils'

const CONFIG_PATH = resolve(import.meta.dirname, '../fixtures/rspack.config.js')
const MULTI_CONFIG_PATH = resolve(import.meta.dirname, '../fixtures/rspack.config.multi.js')

await run({
  name: 'normal',
  options: {
    bundlerConfig: {
      type: 'rspack',
      path: CONFIG_PATH,
    },
  },
  valid: [
    '#test/a',
  ],
  invalid: [],
})

await run({
  name: 'multi-config:merge',
  options: {
    bundlerConfig: {
      type: 'rspack',
      path: MULTI_CONFIG_PATH,
      options: {
        merge: true,
      },
    },
  },
  valid: [
    '#test/a',
  ],
  invalid: [],
})

await run({
  name: 'multi-config:configName',
  options: {
    bundlerConfig: {
      type: 'rspack',
      path: MULTI_CONFIG_PATH,
      options: {
        configName: 'alias',
      },
    },
  },
  valid: [
    '#test/a',
  ],
  invalid: [],
})

await run({
  name: 'multi-config:configName invalid',
  options: {
    bundlerConfig: {
      type: 'rspack',
      path: MULTI_CONFIG_PATH,
      options: {
        configName: 'empty',
      },
    },
  },
  valid: [
  ],
  invalid: [
    '#test/a',
  ],
})
