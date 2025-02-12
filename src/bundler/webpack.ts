import type { NapiResolveOptions } from 'oxc-resolver'
import type { WebpackOptionsNormalized } from 'webpack'
import type { IWebpackCLI } from 'webpack-cli'
import type { BundlerConfigTransformer } from './index'
import { isBoolean, isNil, isString } from 'es-toolkit'
import { EnforceExtension } from 'oxc-resolver'
import { log, mergeOptions, tryRequireThenImport } from '~/utils'

function normalizeOptions(options: WebpackOptionsNormalized) {
  // https://github.com/webpack/webpack/blob/main/declarations/WebpackOptions.d.ts#L1556
  if (options.resolve.byDependency) {
    ['commonjs', 'amd', 'esm'].forEach((k) => {
      const opt = options.resolve.byDependency![k]
      if (!opt)
        return
      options.resolve = mergeOptions(options.resolve, opt)
    })
  }

  for (const key in options.resolve) {
    const _key = key as keyof WebpackOptionsNormalized['resolve']
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

type WebpackResolveOptions = WebpackOptionsNormalized['resolve']

function transformAlias(alias: WebpackResolveOptions['alias']): NapiResolveOptions['alias'] {
  if (isNil(alias))
    return undefined
  function resolveAliasOptions(val: string | false | string[]): (string | null)[] {
    if (isBoolean(val)) {
      return [null]
    } else if (isString(val)) {
      return [val]
    } else {
      return val
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

function transformMainFields(mainFields: WebpackResolveOptions['mainFields']): NapiResolveOptions['mainFields'] {
  return mainFields?.flat()
}

function transformRestrictions(restrictions: WebpackResolveOptions['restrictions']): NapiResolveOptions['restrictions'] {
  return restrictions?.map((val) => {
    if (isString(val)) {
      return { path: val }
    } else {
      return { regex: val.toString() }
    }
  })
}

export interface WebpackTransformerOptions {
  /** only take effect when there are multiple configurations */
  merge?: boolean
  /** only take effect when there are multiple configurations */
  configName?: string
}

export async function transformWebpackConfig(path: string, _options: WebpackTransformerOptions = {}): Promise<NapiResolveOptions> {
  const WebpackCLI = await tryRequireThenImport<new () => IWebpackCLI>('webpack-cli')

  const cli = new WebpackCLI()
  const webpackConfig = await cli.loadConfig({
    // @ts-expect-error waiting https://github.com/webpack/webpack-cli/pull/4378
    nodeEnv: 'production',
    config: [path],
  })

  // https://github.com/webpack/webpack-cli/blob/master/packages/webpack-cli/src/webpack-cli.ts#L2112
  if (Array.isArray(webpackConfig.options)) {
    if (_options.merge) {
      if (webpackConfig.options.length === 1) {
        webpackConfig.options = webpackConfig.options[0]
      } else {
        const merge = await cli.tryRequireThenImport('webpack-merge', false)

        webpackConfig.options = webpackConfig.options.reduce(
          // @ts-expect-error safe type
          (acc, options) => merge(acc, options),
          {},
        )
      }
    } else if (_options.configName) {
      const config = webpackConfig.options.find((options) => options.name === _options.configName)
      if (config) {
        webpackConfig.options = config
      } else {
        log(`config "${_options.configName}" not found`)
        return {}
      }
    } else {
      log('multiple configurations found, please specify `configName` or `merge`')
      return {}
    }
  }

  const webpack = await cli.loadWebpack(false)
  // https://github.com/webpack/webpack/blob/main/lib/webpack.js#L65
  const options = webpack.config.getNormalizedWebpackOptions(webpackConfig.options)
  webpack.config.applyWebpackOptionsDefaults(options)

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
    mainFields: transformMainFields(config.resolve.mainFields),
    mainFiles: config.resolve.mainFiles,
    modules: config.resolve.modules,
    preferAbsolute: config.resolve.preferAbsolute,
    preferRelative: config.resolve.preferRelative,
    restrictions: transformRestrictions(config.resolve.restrictions),
    roots: config.resolve.roots,
    symlinks: config.resolve.symlinks,
  } satisfies NapiResolveOptions
}

// https://github.com/webpack/webpack-cli/blob/master/packages/webpack-cli/src/webpack-cli.ts#L1955
export default {
  filename: ['webpack.config', '.webpack/webpack.config', '.webpack/webpackfile'],
  extensions: ['ts', 'js', 'mts', 'mjs', 'cts', 'cjs'],
  transformConfig: transformWebpackConfig,
} as BundlerConfigTransformer
