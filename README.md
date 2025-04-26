# eslint-import-resolver-oxc

[![npm version][npm-version-src]][npm-url]
[![npm download][npm-download-src]][npm-url]
[![npm bundle size][npm-bundle-size-src]][npm-url]
[![License][license-src]][license-url]

A simply wrapped [`oxc-resolver`](https://github.com/oxc-project/oxc-resolver) for [`eslint-plugin-import-x`](https://github.com/un-ts/eslint-plugin-import-x) and [`eslint-plugin-import`](https://github.com/import-js/eslint-plugin-import).

> [!NOTE]
>
> As of now, [`eslint-import-resolver-typescript`](https://github.com/import-js/eslint-import-resolver-typescript) has been fully optimized for performance by using [`unrs-resolver`](https://github.com/unrs/unrs-resolver).
>
> We recommend prioritizing the officially maintained resolver.

## Feature

A good replacement for [`eslint-import-resolver-node`](https://github.com/import-js/eslint-plugin-import/tree/main/resolvers/node#readme).

You can get more info about _resolver_ in [the README of eslint-plugin-import-x](https://github.com/un-ts/eslint-plugin-import-x?tab=readme-ov-file#resolvers).

## Usage

### Installation

```bash
npm install eslint-import-resolver-oxc --save-dev
```

### Add script for eslint.config.js

For [`eslint-plugin-import-x(>=4.5.0)`](https://github.com/un-ts/eslint-plugin-import-x/releases/tag/v4.5.0):
```js
// eslint.config.js
export default [
  {
    settings: {
      'import-x/resolver-next': [
        createOxcImportResolver({
          // resolver options
        }),
        // other resolvers
      ]
    }
  }
]
```

<details>
<summary>For `eslint-plugin-import-x(<4.5.0)`:</summary>

> [!NOTE]
>
> According to https://github.com/un-ts/eslint-plugin-import-x/blob/master/src/utils/resolve.ts#L155
>
> The settings prefix is hard coded as `import-x/` even with flat config.

```js
// eslint.config.js
export default [
  {
    settings: {
      'import-x/resolver': 'oxc'
    }
  }
]
```
or
```js
// eslint.config.js
export default [
  {
    settings: {
      'import-x/resolver': {
        oxc: true
        // other resolvers...
      }
    }
  }
]
```
or
```js
// eslint.config.js
export default [
  {
    settings: {
      'import-x/resolver': {
        oxc: {
          // resolver options...
        },
        // other resolvers...
      }
    }
  }
]
```
</details>

For `eslint-plugin-import`:

Replace `import-x/resolver` with `import/resolver` in the object above.

### Options

Default options see [normalizeOptions.ts](./src/normalizeOptions.ts)

#### bundlerConfig (experimental, only supported in `async` function)

This option can be a string or an object.

String option:

the path of the bundler's config file.

Object option:

- type: the type of the bundler.
- path: the config of the bundler.
- options: some special options for bundler config.

If only the `type` is specified, the configuration file in the root directory (`cwd`) will be automatically detected, similar to how `tsconfig` is handled.

If only the `path` is specified, the`type` will be inferred based on the filename.

``` js
// eslint.config.js
import { createOxcImportResolver, transformViteConfig } from 'eslint-import-resolver-oxc'

export default [
  {
    settings: {
      'import-x/resolver-next': [
        await createOxcImportResolver({
          bundlerConfig: 'vite.config.ts',
        }),
      ]
    }
  }
]
```

#### others

The `jsconfig.json` and `tsconfig.json` in the root directory (`cwd`) will automatically detected.

More options see [oxc-resolver](https://github.com/oxc-project/oxc-resolver?tab=readme-ov-file#options)

## Motivation

Eslint is a bit slow in large projects. While I [track the performance of the rules](https://eslint.org/docs/latest/extend/custom-rules#profile-rule-performance), I found that `eslint-plugin-import-x` took a lot of time. I thought change a resolver might bring some improvements.

## Credit

I can't finish the project without the help of [`oxc-resolver`](https://github.com/oxc-project/oxc-resolver).

Thanks [@Boshen](https://github.com/Boshen) for his work on [`oxc-resolver`](https://github.com/oxc-project/oxc-resolver).

## License

[MIT](./LICENSE) License &copy; 2024-PRESENT [Vida Xie](https://github.com/9romise)

[npm-version-src]: https://img.shields.io/npm/v/eslint-import-resolver-oxc?color=91ede9
[npm-download-src]: https://img.shields.io/npm/dm/eslint-import-resolver-oxc?color=91ede9
[npm-bundle-size-src]: https://img.shields.io/npm/unpacked-size/eslint-import-resolver-oxc?color=91ede9
[npm-url]: https://npmjs.com/package/eslint-import-resolver-oxc
[license-src]: https://img.shields.io/npm/l/eslint-import-resolver-oxc?color=91ede9
[license-url]: https://opensource.org/licenses/MIT
[oxc-resolver-link]: [`oxc-resolver`](https://github.com/oxc-project/oxc-resolver)
