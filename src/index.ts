import type { NapiResolveOptions } from 'oxc-resolver'
import { isBuiltin } from 'node:module'
import { dirname } from 'node:path'
import { ResolverFactory } from 'oxc-resolver'
import { normalizeOptions } from './normalizeOptions'
import { hashObject } from './utils'

let cacheOptionsHash: string | undefined
let cachedResolver: ResolverFactory | undefined

export function resolve(source: string, file: string, options?: NapiResolveOptions | null, resolver: ResolverFactory | null = null): { found: boolean, path: string | null | undefined } {
  if (isBuiltin(source))
    return { found: true, path: null }

  if (resolver == null) {
    options ??= {}
    const optionsHash = hashObject(options)

    if (!cachedResolver || cacheOptionsHash !== optionsHash) {
      options = normalizeOptions(options)
      cachedResolver = new ResolverFactory(options)
      cacheOptionsHash = optionsHash
    }

    resolver = cachedResolver
  }

  // https://github.com/oxc-project/oxc-resolver/blob/main/npm/README.md#api
  const result = resolver.sync(dirname(file), source)

  return {
    found: !!result.path,
    path: result.path,
  }
}

export const interfaceVersion = 2

export function createOxcResolver(options?: NapiResolveOptions | null) {
  const resolver = new ResolverFactory(options)

  return {
    interfaceVersion: 3,
    name: 'eslint-import-resolver-oxc',
    resolve(source: string, file: string) {
      return resolve(source, file, null, resolver)
    },
  }
}
