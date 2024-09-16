import type { RuleTesterInitOptions, TestCasesOptions } from 'eslint-vitest-rule-tester'
import path from 'node:path'
import tsParser from '@typescript-eslint/parser'
import { rules } from 'eslint-plugin-import-x'
import { run as _run } from 'eslint-vitest-rule-tester'

export * from 'eslint-vitest-rule-tester'
export { unindent as $ } from 'eslint-vitest-rule-tester'

export interface ExtendedRuleTesterOptions extends RuleTesterInitOptions, TestCasesOptions {
  lang?: 'js' | 'ts'
  rule: keyof typeof rules
}

export function run(options: ExtendedRuleTesterOptions) {
  return _run({
    recursive: false,
    verifyAfterFix: false,
    configs: {
      settings: {
        'import-x/resolver': 'oxc',
      },
    },
    ...(options.lang === 'js' ? {} : { parser: tsParser as any }),
    ...options,
    rule: rules[options.rule],
  })
}

export const FIXTURES_PATH = path.resolve('test/fixtures')

export function testFilePath(relativePath = 'foo.js') {
  return path.resolve(FIXTURES_PATH, relativePath)
}
