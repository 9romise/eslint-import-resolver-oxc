import type { BundlerConfigTransformer } from '@/typings'
import type { Configuration, WebpackOptionsNormalized } from 'webpack'
import type { IWebpackCLI } from 'webpack-cli'
import { mergeOptions } from '@/utils'
import { isBoolean, isNil, isString } from 'es-toolkit'
import { EnforceExtension, type NapiResolveOptions } from 'oxc-resolver'
import webpack from 'webpack'
import WebpackCLI from 'webpack-cli'

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

export async function transformWebpackConfig(path: string): Promise<NapiResolveOptions> {
  const cli = new (WebpackCLI as new () => IWebpackCLI)()
  const webpackConfig = await cli.loadConfig({
    config: [path],
  })
  // https://github.com/webpack/webpack/blob/main/lib/webpack.js#L65
  const options = webpack.config.getNormalizedWebpackOptions(webpackConfig.options as Configuration)
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