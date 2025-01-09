import type { NapiResolveOptions } from 'oxc-resolver'
import { createHash } from 'node:crypto'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { cwd } from 'node:process'

export const hashCache = new WeakMap<NapiResolveOptions, string>()

export function generateHash(obj: any): string {
  function normalize(obj: any): string {
    if (obj === null || obj === 'undefined') {
      return 'null'
    } else if (typeof obj !== 'object') {
      return obj.toString()
    } else if (Array.isArray(obj)) {
      return `[${obj.map(normalize).sort().join(',')}]`
    }
    const sortedKeys = Object.keys(obj).sort()
    return `{${sortedKeys.map((key) => `${key}:${normalize(obj[key])}`).join(',')}}`
  }

  const normalizedString = normalize(obj)
  return createHash('md5').update(normalizedString).digest('hex')
}

export function hashObject(obj: NapiResolveOptions): string {
  if (hashCache.has(obj)) {
    return hashCache.get(obj)!
  }

  const hash = generateHash(obj)
  hashCache.set(obj, hash)
  return hash
}

export function detectFile(files: string[]) {
  for (const file of files) {
    const absPath = resolve(cwd(), file)
    if (existsSync(absPath)) {
      return absPath
    }
  }
}

export function log(...args: any[]) {
  // eslint-disable-next-line no-console
  return console.log('[eslint-import-resolver-oxc]: ', ...args)
}
