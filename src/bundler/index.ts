import type { BundlerConfigTransformer, BundlerOption, SupportedBundler } from '@/typings'
import { existsSync } from 'node:fs'
import { basename, resolve } from 'node:path'
import { cwd } from 'node:process'
import { detectFile, log } from '@/utils'
import vite from './vite'

const bundlerConfig: Record<SupportedBundler, BundlerConfigTransformer> = {
  vite,
}

export async function getBundlerConfig(options?: BundlerOption | null) {
  if (options == null)
    return {}

  if (typeof options === 'string') {
    options = {
      path: options,
    }
  }

  let { type, path } = options

  if (!type && !path) {
    log('either `type` or `path` must be specified')
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
    path = detectFile(extensions.map((ext) => `${filename}.${ext}`))
  }

  if (!path || !existsSync(path)) {
    log(`cannot find ${path}`)
    return {}
  }

  path = resolve(cwd(), path)
  return await config.transformConfig(path)
}
