import type { NapiResolveOptions } from 'oxc-resolver'
import { createHash } from 'node:crypto'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { cwd } from 'node:process'
import { pathToFileURL } from 'node:url'
import { cloneDeep, isPlainObject, mergeWith } from 'es-toolkit'

export const hashCache: WeakMap<NapiResolveOptions, string> = new WeakMap<NapiResolveOptions, string>()

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

export function detectFile(files: string[]): string | undefined {
  for (const file of files) {
    const absPath = resolve(cwd(), file)
    if (existsSync(absPath)) {
      return absPath
    }
  }
}

export function mergeOptions(a: object, b: object): object {
  if (!a)
    return cloneDeep(b)
  if (!b)
    return cloneDeep(a)
  const res = cloneDeep(a)

  function mergeFunc(tar: any, src: any) {
    if (Array.isArray(tar) && Array.isArray(src)) {
      return [...new Set(tar.concat(src))]
    } else if (isPlainObject(tar) && isPlainObject(src)) {
      return mergeWith(tar, src, mergeFunc)
    }
  }

  return mergeWith(res, b, mergeFunc)
}

export function log(...args: any[]): void {
  // eslint-disable-next-line no-console
  return console.log('[eslint-import-resolver-oxc]', ...args)
}

export async function tryRequireThenImport<T>(module: string): Promise<T> {
  try {
    // eslint-disable-next-line ts/no-require-imports
    return require(module)
  } catch (error: any) {
    if (error.code === 'ERR_REQUIRE_ESM' || error.code === 'ERR_REQUIRE_ASYNC_MODULE') {
      const url = pathToFileURL(module)
      return (await import(url.toString())).default
    } else {
      throw error
    }
  }
}

export function removeQuerystring(id: string): string {
  const querystringIndex = id.lastIndexOf('?')
  if (querystringIndex >= 0) {
    return id.slice(0, querystringIndex)
  }
  return id
}
