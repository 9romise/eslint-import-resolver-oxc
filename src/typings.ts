import type { NapiResolveOptions } from 'oxc-resolver'

export interface ImportResolver {
  interfaceVersion: 3
  name: string
  resolve: (source: string, file: string) => { found: boolean, path: string | null | undefined }
}

export type SupportedBundler = 'vite' | 'webpack'

export type BundlerOption = string | {
  type?: SupportedBundler
  path?: string
}

export interface BundlerConfigTransformer {
  filename: string[]
  extensions: string[]
  transformConfig: (conf: any) => Promise<NapiResolveOptions>
}

export interface OxcResolverOptions extends NapiResolveOptions {
  /** @experimental detect bundler's resolve config */
  bundlerConfig?: BundlerOption
}
