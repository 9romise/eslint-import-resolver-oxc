import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { cwd } from 'node:process'
import { describe, expect, it } from 'vitest'
import { resolve } from '../src'

const __filename = fileURLToPath(import.meta.url)

function expectResolve(source: string, found: boolean, expectPath?: string) {
  const result = resolve(source, __filename)
  expect(result.found).toBe(found)
  if (expectPath)
    expect(result.path).toBe(path.resolve(cwd(), expectPath))
}

describe('resolve', () => {
  it('node builtin', () => {
    expectResolve('path', true)
    expectResolve('node:path', true)
  })

  it('node_modules', () => {
    expectResolve('vitest', true)
    expectResolve('lodash', false)
  })

  it('file', () => {
    expectResolve('../.gitignore', true)
    expectResolve('../package.json', true)
    expectResolve('../README.md', true)
    expectResolve('../.github/dependabot.yml', true)
    expectResolve('../vitest.config.ts', true)
    expectResolve('../vitest.config', true)
    expectResolve('../src/index', true, 'src/index.ts')
    expectResolve('../src', true, 'src/index.ts')

    expectResolve('../inexistent.ts', false)
  })

  it('alias', () => {
    expectResolve('@/index.ts', true)
    expectResolve('@/index', true)
  })
})
