import type { NapiResolveOptions } from 'oxc-resolver'
import type { OxcResolverOptions } from '~/typings'
import { existsSync } from 'node:fs'
import { basename, resolve } from 'node:path'
import { cwd } from 'node:process'
import { detectFile, log } from '~/utils'
import rspack from './rspack'
import vite from './vite'
import webpack from './webpack'

const bundlerConfig = {
  vite,
  webpack,
  rspack,
}

export type SupportedBundler = keyof typeof bundlerConfig

export interface BundlerConfigTransformer {
  filename: string[]
  extensions: string[]
  transformConfig: (path: string, options?: any) => Promise<NapiResolveOptions>
}

export async function getBundlerConfig(options?: OxcResolverOptions['bundlerConfig'] | null) {
  if (options == null)
    return {}

  if (typeof options === 'string') {
    options = {
      path: options,
    }
  }

  let { type, path } = options

  if (!type && !path) {
    log('Either `type` or `path` must be specified')
    return {}
  }

  if (!type) {
    type = basename(path!).split('.')[0] as SupportedBundler
  }

  const config = bundlerConfig[type]

  if (!config) {
    log(`"${type}" config is not supported now`)
    return {}
  }

  if (!path) {
    const { filename, extensions } = config
    path = detectFile(
      filename.flatMap((file) => extensions.map((ext) => `${file}.${ext}`)),
    )
  }

  if (!path) {
    log(`Can't detect the bundler config, please try specify 'path'`)
    return {}
  }

  path = resolve(cwd(), path)

  if (!existsSync(path)) {
    log(`Can't find ${type} config: ${path}`)
    return {}
  }
  return await config.transformConfig(path, options?.options).catch((err) => {
    log(err)
    return {}
  })
}
