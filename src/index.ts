import type { NapiResolveOptions } from 'oxc-resolver'
import type { ImportResolver, OxcResolverOptions } from './typings'
import { isBuiltin } from 'node:module'
import { dirname } from 'node:path'
import { isNil, pickBy } from 'es-toolkit'
import { ResolverFactory } from 'oxc-resolver'
import { stableHash } from 'stable-hash-x'
import { getBundlerConfig } from './bundler'
import { normalizeOptions } from './normalizeOptions'
import { removeQuerystring } from './utils'

export * from './bundler/exports'
export * from './typings'

let cachedOptionsHash: string | undefined
let cachedResolver: ResolverFactory | undefined

export function resolve(source: string, file: string, options?: OxcResolverOptions | null, resolver: ResolverFactory | null = null): { found: boolean, path: string | null | undefined } {
  if (isBuiltin(source))
    return { found: true, path: null }

  if (resolver == null) {
    options ??= {}
    const optionsHash = stableHash(options)

    if (!cachedResolver || cachedOptionsHash !== optionsHash) {
      options = normalizeOptions(options)
      cachedResolver = new ResolverFactory(options)
      cachedOptionsHash = optionsHash
    }

    resolver = cachedResolver
  }

  source = removeQuerystring(source)

  // https://github.com/oxc-project/oxc-resolver/blob/main/npm/README.md#api
  const result = resolver.sync(dirname(file), source)

  return {
    found: !!result.path,
    path: result.path,
  }
}

export const interfaceVersion = 2

export function createOxcImportResolver(options?: NapiResolveOptions): ImportResolver
export function createOxcImportResolver(options?: OxcResolverOptions): Promise<ImportResolver>
export function createOxcImportResolver(options?: OxcResolverOptions | NapiResolveOptions) {
  if (options && Object.prototype.hasOwnProperty.call(options, 'bundlerConfig')) {
    return new Promise((resolve) => {
      getBundlerConfig((options as OxcResolverOptions).bundlerConfig).then((bundlerOptions) => {
        const resolver = createResolver({
          ...pickBy(bundlerOptions, (val) => !isNil(val)),
          ...options,
        })
        resolve(resolver)
      })
    })
  } else {
    return createResolver(options)
  }
}

export async function createOxcImportResolverAsync(options: OxcResolverOptions): Promise<ImportResolver> {
  return await createOxcImportResolver(options)
}

function createResolver(options?: OxcResolverOptions) {
  const resolvedOptions = normalizeOptions(options)
  const resolver = new ResolverFactory(resolvedOptions)

  return {
    interfaceVersion: 3,
    name: 'eslint-import-resolver-oxc',
    resolve(source: string, file: string) {
      return resolve(source, file, null, resolver)
    },
  }
}
