import type { NapiResolveOptions } from 'oxc-resolver'
import { createHash } from 'node:crypto'
import { isBuiltin } from 'node:module'
import { dirname } from 'node:path'
import { ResolverFactory } from 'oxc-resolver'
import { normalizeOptions } from './normalizeOptions'

const hashCache = new WeakMap<NapiResolveOptions, string>()
function hashObject(obj: NapiResolveOptions): string {
  if (hashCache.has(obj)) {
    return hashCache.get(obj)!
  }
  const jsonString = JSON.stringify(obj, Object.keys(obj).sort())

  const hash = createHash('sha256').update(jsonString).digest('hex')

  hashCache.set(obj, hash)
  return hash
}

let cacheOptionsHash: string | undefined
let resolver: ResolverFactory | undefined
export function resolve(source: string, file: string, options?: NapiResolveOptions | null): { found: boolean, path: string | null | undefined } {
  if (isBuiltin(source))
    return { found: true, path: null }

  options ??= {}
  const optionsHash = hashObject(options)

  if (!resolver || cacheOptionsHash !== optionsHash) {
    options = normalizeOptions(options)
    resolver = new ResolverFactory(options)
    cacheOptionsHash = optionsHash
  }

  // https://github.com/oxc-project/oxc-resolver/blob/main/npm/README.md#api
  const result = resolver.sync(dirname(file), source)

  return {
    found: !!result.path,
    path: result.path,
  }
}

export const interfaceVersion = 2
