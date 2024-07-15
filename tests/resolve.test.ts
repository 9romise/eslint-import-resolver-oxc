import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { resolve } from '../src'

const file = fileURLToPath(import.meta.url)

function expectResolve(source: string, found: boolean, path?: string) {
  const result = resolve(source, file)
  expect(result.found).toBe(found)
  if (path)
    expect(result.path).toBe(path)
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
    expectResolve('../vitest.config.ts', true)
    expectResolve('../.github/dependabot.yml', true)

    expectResolve('../inexistent.ts', false)
  })
})
