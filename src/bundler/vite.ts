import type { NapiResolveOptions } from 'oxc-resolver'
import type { Alias } from 'vite'
import type { BundlerConfigTransformer } from './index'
import { tryRequireThenImport } from '~/utils'

export interface ViteTranformerOptions {}

export async function transformViteConfig(path: string): Promise<NapiResolveOptions> {
  const { resolveConfig } = await tryRequireThenImport<typeof import('vite')>('vite')
  const config = await resolveConfig({ configFile: path }, 'build', 'production', 'production')

  const { alias } = config.resolve

  const resolvedAlias: NapiResolveOptions['alias'] = {}

  if (Array.isArray(alias)) {
    const _alias = alias as Alias[]
    _alias.forEach(({ find, replacement }) => {
      if (typeof find === 'string')
        resolvedAlias[find] = [replacement]
    })
  } else if (alias) {
    const _alias = alias as { [find: string]: string }
    for (const find in _alias) {
      resolvedAlias[find] = [_alias[find]]
    }
  }

  return {
    alias: resolvedAlias,
    mainFields: config.resolve.mainFields,
    extensions: config.resolve.extensions,
    conditionNames: config.resolve.conditions,
    symlinks: config.resolve.preserveSymlinks,
  }
}

export default {
  filename: ['vite.config'],
  extensions: ['ts', 'js', 'mts', 'mjs', 'cts', 'cjs'],
  transformConfig: transformViteConfig,
} as BundlerConfigTransformer
