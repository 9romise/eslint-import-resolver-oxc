import type { NapiResolveOptions } from 'oxc-resolver'
import type { ViteTranformerOptions } from './bundler/vite'
import type { WebpackTransformerOptions } from './bundler/webpack'

export interface ImportResolver {
  interfaceVersion: 3
  name: string
  resolve: (source: string, file: string) => { found: boolean, path: string | null | undefined }
}

export type SupportedBundler = keyof BundlerTransformerOptions

export type BundlerOption = string | {
  type?: SupportedBundler
  path?: string
  options?: BundlerTransformerOptions[SupportedBundler]
}

interface BundlerTransformerOptions {
  vite: ViteTranformerOptions
  webpack: WebpackTransformerOptions
}

export interface BundlerConfigTransformer<T extends SupportedBundler = any> {
  filename: string[]
  extensions: string[]
  transformConfig: (path: string, options?: BundlerTransformerOptions[T]) => Promise<NapiResolveOptions>
}

export interface OxcResolverOptions extends NapiResolveOptions {
  /** @experimental detect bundler's resolve config */
  bundlerConfig?: BundlerOption
}
