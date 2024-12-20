import path from 'node:path'
import { cwd } from 'node:process'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { resolve } from '../../src'

const __filename = fileURLToPath(import.meta.url)

function expectResolve(source: string, found: boolean | string) {
  it(`${source} => ${found}`, () => {
    const result = resolve(source, __filename)
    if (typeof found === 'string') {
      expect(result.path).toBe(path.resolve(cwd(), found))
    } else {
      expect(result.found).toBe(found)
    }
  })
}

describe('builtin', () => {
  expectResolve('path', true)
  expectResolve('node:path', true)
})

describe('modules', () => {
  expectResolve('vitest', true)
  expectResolve('lodash', false)
})

describe('relative', () => {
  expectResolve('../../.gitignore', true)
  expectResolve('../../package.json', true)
  expectResolve('../../README.md', true)
  expectResolve('../../.github/dependabot.yml', true)
  expectResolve('../../vitest.config.ts', true)
  expectResolve('../../vitest.config', true)
  expectResolve('../../src/index', 'src/index.ts')
  expectResolve('../../src', 'src/index.ts')

  expectResolve('../inexistent.ts', false)
})

describe('absolute', () => {
  // TODO
  // expectResolve('.gitignore', true)
  expectResolve('package.json', true)
  expectResolve('README.md', true)
  // TODO
  // expectResolve('.github/dependabot.yml', true)
  expectResolve('vitest.config.ts', true)
  expectResolve('vitest.config', true)
  expectResolve('src/index.ts', true)
  expectResolve('src/index', true)

  expectResolve('index.ts', false)
})

describe('tsconfig alias', () => {
  expectResolve('@/index.ts', true)
  expectResolve('@/index', true)
})
