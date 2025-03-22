import type { RuleTesterInitOptions, TestCasesOptions } from 'eslint-vitest-rule-tester'
import path from 'node:path'
import tsParser from '@typescript-eslint/parser'
import { rules } from 'eslint-plugin-import-x'
import { run as _run } from 'eslint-vitest-rule-tester'
import { createOxcImportResolver } from '../../src'

export { createOxcImportResolver } from '../../src'
export { unindent as $ } from 'eslint-vitest-rule-tester'
export * from 'eslint-vitest-rule-tester'

export interface ExtendedRuleTesterOptions extends RuleTesterInitOptions, TestCasesOptions {
  lang?: 'js' | 'ts'
  rule: keyof typeof rules
}

export const FIXTURES_PATH: string = path.resolve(import.meta.dirname, './fixtures')

export function testFilePath(relativePath = 'foo.js'): string {
  return path.resolve(FIXTURES_PATH, relativePath)
}

const defaultFilenames = {
  js: 'tests/eslint-plugin/fixtures/foo.js',
  ts: 'tests/eslint-plugin/fixtures/foo.ts',
}

export function run(options: ExtendedRuleTesterOptions): Promise<void> {
  return _run({
    recursive: false,
    verifyAfterFix: false,
    defaultFilenames,
    configs: {
      settings: {
        ...(options.lang === 'js' ? {} : { 'import-x/parsers': { [require.resolve('@typescript-eslint/parser')]: ['.ts'] } }),
        'import-x/resolver-next': [
          createOxcImportResolver({
            tsconfig: {
              configFile: path.resolve(FIXTURES_PATH, 'tsconfig.json'),
              references: 'auto',
            },
            roots: [FIXTURES_PATH],
          }),
        ],
      },
    },
    ...(options.lang === 'js' ? {} : { parser: tsParser as any }),
    ...options,
    languageOptions: {
      ...options.languageOptions,
      sourceType: 'module',
      ecmaVersion: 9,
      parserOptions: {
        tsconfigRootDir: path.dirname(testFilePath()),
        ...options.languageOptions?.parserOptions,
      },
    },
    name: options.rule,
    rule: rules[options.rule],
  })
}
