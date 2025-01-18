import { resolve } from 'node:path'
import { run } from '../utils'

const CONFIG_PATH = resolve(import.meta.dirname, '../fixtures/webpack.config.js')
const MULTI_CONFIG_PATH = resolve(import.meta.dirname, '../fixtures/webpack.config.multi.js')

await run({
  name: 'normal',
  options: {
    bundlerConfig: {
      type: 'webpack',
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
      type: 'webpack',
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
      type: 'webpack',
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
      type: 'webpack',
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
