import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { createOxcImportResolver } from '../../src/index'

const rs = (...p: string[]) => resolve(import.meta.dirname, ...p)

const resolver = createOxcImportResolver({
  tsconfig: {
    configFile: rs('./fixtures/jsconfig.json'),
  },
})

describe('jsconfig', () => {
  it('should work', () => {
    expect(resolver.resolve('#test/a', rs('./fixtures/index.js'))).toEqual({
      found: true,
      path: rs('./fixtures/src/a.js'),
    })
  })
})
