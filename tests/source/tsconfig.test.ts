import { resolve } from 'node:path'
import { run } from './utils'

const rs = (...p: string[]) => resolve(import.meta.dirname, ...p)

run({
  name: 'tsconfig',
  valid: [
    { source: '@/index.ts', path: resolve('src/index.ts') },
    { source: '@/index', path: resolve('src/index.ts') },
  ],
  invalid: [],
})

run({
  name: 'jsconfig',
  options: {
    tsconfig: {
      configFile: rs('./fixtures/jsconfig.json'),
    },
  },
  valid: [
    { source: '#test/a', file: rs('./fixtures/index.js'), path: rs('./fixtures/src/a.js') },
  ],
  invalid: [],
})
