import type { NapiResolveOptions } from 'oxc-resolver'
import { ResolverFactory } from 'oxc-resolver'
import { normalizeOptions } from './nomalizeOptions'

let resolver: ResolverFactory | undefined
export function resolve(source: string, file: string, options: NapiResolveOptions | null = {}): { found: boolean, path?: string } {
  if (!resolver) {
    options = normalizeOptions(options)
    resolver = new ResolverFactory(options)
  }

  const result = resolver.sync(file, source)

  return {
    found: !!result.path,
    path: result.path,
  }
}

export const interfaceVersion = 2
