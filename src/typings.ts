import type { NapiResolveOptions } from 'oxc-resolver'
import type { RspackTransformerOptions } from './bundler/rspack'
import type { ViteTranformerOptions } from './bundler/vite'
import type { WebpackTransformerOptions } from './bundler/webpack'

export interface ImportResolver {
  interfaceVersion: 3
  name: string
  resolve: (source: string, file: string) => { found: boolean, path: string | null | undefined }
}

interface BundlerTransformerOptions {
  vite: ViteTranformerOptions
  webpack: WebpackTransformerOptions
  rspack: RspackTransformerOptions
}

export type SupportedBundler = 'vite' | 'webpack' | 'rspack'

export type BundlerOption<T extends SupportedBundler = SupportedBundler> = {
  [K in SupportedBundler]: {
    type?: K
    path?: string
    options?: BundlerTransformerOptions[K]
  }
}[T]

export interface OxcResolverOptions extends NapiResolveOptions {
  /** @experimental detect bundler's resolve config */
  bundlerConfig?: string | BundlerOption
}
