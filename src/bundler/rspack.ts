import type { ResolveOptions, RspackOptions, RspackOptionsNormalized } from '@rspack/core'
import type { NapiResolveOptions } from 'oxc-resolver'
import type { BundlerConfigTransformer } from './index'
import { log, mergeOptions, tryRequireThenImport } from '@/utils'
import { isBoolean, isNil, isString } from 'es-toolkit'
import { EnforceExtension } from 'oxc-resolver'

function normalizeOptions(options: RspackOptionsNormalized) {
  if (!options.resolve)
    return
  if (options.resolve.byDependency) {
    ['commonjs', 'amd', 'esm'].forEach((k) => {
      const opt = options.resolve!.byDependency![k]
      if (!opt)
        return
      options.resolve = mergeOptions(options.resolve!, opt)
    })
  }

  for (const key in options.resolve) {
    const _key = key as keyof ResolveOptions
    if (Object.prototype.hasOwnProperty.call(options.resolve, _key)) {
      const val = options.resolve[_key]
      if (Array.isArray(val)) {
        // @ts-expect-error safe type
        options.resolve[_key]
          = val.filter((v) => v !== '...')
      }
    }
  }

  return options
}

function transformAlias(alias: ResolveOptions['alias']): NapiResolveOptions['alias'] {
  if (isNil(alias))
    return undefined
  function resolveAliasOptions(val: string | false | (string | false)[]): (string | null)[] {
    if (isBoolean(val)) {
      return [null]
    } else if (isString(val)) {
      return [val]
    } else {
      return val.map((v) => (isBoolean(v) ? null : v))
    }
  }

  const _alias: NapiResolveOptions['alias'] = {}
  if (Array.isArray(alias)) {
    alias.forEach(({ alias, name }) => {
      _alias[name] = resolveAliasOptions(alias)
    })
  } else if (alias) {
    for (const name in alias) {
      _alias[name] = resolveAliasOptions(alias[name])
    }
  }
  return _alias
}

function transformRestrictions(restrictions: ResolveOptions['restrictions']): NapiResolveOptions['restrictions'] {
  return restrictions?.map((val) => ({ path: val }))
}

function transformTsConfig(tsConfig: ResolveOptions['tsConfig']): NapiResolveOptions['tsconfig'] {
  if (!tsConfig)
    return undefined
  if (isString(tsConfig))
    return { configFile: tsConfig }
  return tsConfig
}

export interface RspackTransformerOptions {
  /** only take effect when there are multiple configurations */
  merge?: boolean
  /** only take effect when there are multiple configurations */
  configName?: string
}

export async function transformWebpackConfig(path: string, _options: RspackTransformerOptions = {}): Promise<NapiResolveOptions> {
  const { RspackCLI } = await tryRequireThenImport<typeof import('@rspack/cli')>('@rspack/cli')

  const cli = new RspackCLI()
  let rspackOptions = await cli.loadConfig({
    config: path,
    configName: _options.configName ? [_options.configName] : undefined,
  })

  if (Array.isArray(rspackOptions)) {
    if (_options.merge) {
      if (rspackOptions.length === 1) {
        rspackOptions = rspackOptions[0]
      } else {
        const { merge } = await tryRequireThenImport<typeof import('webpack-merge')>('webpack-merge')

        const merged = rspackOptions.reduce((acc, option) => merge(acc, option), {})
        rspackOptions = merged
      }
    } else if (_options.configName) {
      rspackOptions = rspackOptions.find((options) => options.name === _options.configName)
      if (!rspackOptions) {
        log(`config "${_options.configName}" not found`)
        return {}
      }
    } else {
      log('multiple configurations found, please specify `configName` or `merge`')
      return {}
    }
  }

  const { config: rspackConfig } = await tryRequireThenImport<typeof import('@rspack/core')>('@rspack/core')
  const options = rspackConfig.getNormalizedRspackOptions(rspackOptions as RspackOptions)
  rspackConfig.applyRspackOptionsDefaults(options)

  const config = normalizeOptions(options)
  if (!config || !config.resolve)
    return {}

  return {
    alias: transformAlias(config.resolve.alias),
    aliasFields: config.resolve.aliasFields,
    conditionNames: config.resolve.conditionNames,
    descriptionFiles: config.resolve.descriptionFiles,
    enforceExtension: isNil(config.resolve.enforceExtension)
      ? EnforceExtension.Auto
      : config.resolve.enforceExtension
        ? EnforceExtension.Enabled
        : EnforceExtension.Disabled,
    exportsFields: config.resolve.exportsFields,
    extensionAlias: transformAlias(config.resolve.extensionAlias) as Record<string, string[]>,
    extensions: config.resolve.extensions,
    fallback: transformAlias(config.resolve.fallback),
    fullySpecified: config.resolve.fullySpecified,
    importsFields: config.resolve.importsFields,
    mainFields: config.resolve.mainFields,
    mainFiles: config.resolve.mainFiles,
    modules: config.resolve.modules,
    preferAbsolute: config.resolve.preferAbsolute,
    preferRelative: config.resolve.preferRelative,
    restrictions: transformRestrictions(config.resolve.restrictions),
    roots: config.resolve.roots,
    symlinks: config.resolve.symlinks,
    tsconfig: transformTsConfig(config.resolve.tsConfig),
  } satisfies NapiResolveOptions
}

export default {
  filename: ['rspack.config'],
  // https://rspack.dev/config/index#typescript-configuration-file ts is not natively supported.
  extensions: ['js', 'mjs', 'cjs'],
  transformConfig: transformWebpackConfig,
} as BundlerConfigTransformer
