import process from 'node:process'
import type { NapiResolveOptions } from 'oxc-resolver'
import { ResolverFactory } from 'oxc-resolver'

type Resolve = (source: string, file: string, config: NapiResolveOptions) => { found: boolean, path?: string }

const DEFAULT_OPTIONS: NapiResolveOptions = {
  extensions: ['.ts', '.tsx', '.d.ts', '.js', '.jsx'],
  preferRelative: true,
  conditionNames: ['node', 'import'],
  roots: [process.cwd()],
}

let resolver: ResolverFactory | undefined

function normalizeOptions(options?: NapiResolveOptions): NapiResolveOptions {
  if (!options)
    return DEFAULT_OPTIONS

  return {
    ...DEFAULT_OPTIONS,
    ...options,
  }
}

export const interfaceVersion = 2
export const resolve: Resolve = (source: string, file: string, options?: NapiResolveOptions) => {
  if (!resolver) {
    resolver = new ResolverFactory(normalizeOptions(options))
  }

  const result = resolver.sync(file, source)

  return {
    found: !!result.path,
    path: result.path,
  }
}
