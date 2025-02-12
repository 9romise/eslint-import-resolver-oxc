import type { OxcResolverOptions } from '~/typings'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { createOxcImportResolver } from '~/index'

interface TestCaseBase {
  source: string
  file?: string
}

interface ValidTestCase extends TestCaseBase {
  path?: string
}

interface InvalidTestCase extends TestCaseBase {
}

interface Options {
  name: string
  options?: OxcResolverOptions
  valid: (ValidTestCase | string)[]
  invalid: (InvalidTestCase | string)[]
}

const defaultFileName = resolve(import.meta.dirname, 'fixtrues', 'index.ts')

export async function run({ name, options: config, valid, invalid }: Options) {
  const resolver = await createOxcImportResolver(config)

  function normalizeCases<T extends ValidTestCase | InvalidTestCase>(cases: (T | string)[]) {
    return cases.map((_case) => {
      if (typeof _case === 'string')
        return { source: _case } as T
      else
        return _case
    })
  }

  describe(name, () => {
    normalizeCases(valid).forEach((testCase) => {
      it(testCase.source, () => {
        const { found, path } = resolver.resolve(testCase.source, testCase.file || defaultFileName)

        expect(found).toBe(true)
        if (testCase.path)
          expect(path).toBe(testCase.path)
      })
    })

    normalizeCases(invalid).forEach((testCase) => {
      it(testCase.source, () => {
        const { found } = resolver.resolve(testCase.source, testCase.file || defaultFileName)

        expect(found).toBe(false)
      })
    })
  })
}
