# eslint-import-resolver-oxc

[![npm version][npm-version-src]][npm-url]
[![npm download][npm-download-src]][npm-url]
[![npm bundle size][npm-bundle-size-src]][npm-url]
[![License][license-src]][license-url]

A simply wrapped [`oxc-resolver`](https://github.com/oxc-project/oxc-resolver) for [`eslint-plugin-import-x`](https://github.com/un-ts/eslint-plugin-import-x) and [`eslint-plugin-import`](https://github.com/import-js/eslint-plugin-import).

## Feature

A good replacement for [`eslint-import-resolver-node`](https://github.com/import-js/eslint-plugin-import/tree/main/resolvers/node#readme) and [`eslint-import-resolver-typescript`](https://github.com/import-js/eslint-import-resolver-typescript).

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

For `eslint-plugin-import-x(<4.5.0)`:

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

For `eslint-plugin-import`:

Replace `import-x/resolver` with `import/resolver` in the object above.

### Options

Default options see [normalizeOptions.ts](./src/normalizeOptions.ts)

#### bundlerConfig (experimental)

This option can be a string or an object.

String option:

the path of the bundler's config file.

Object option:

- type: the type of the bundler.
- path: the config of the bundler.

If only the `type` is specified, the configuration file in the root directory (`cwd`) will be automatically detected, similar to how `tsconfig` is handled.

If only the `path` is specified, the`type` will be inferred based on the filename.

> [!NOTE]
>
> If your configuration file uses ESM, the bundler option might not work in earlier Node.js versions (<22).
>
> You can use the transform method (e.g., `transformViteConfig`) to transform your bundler configuration.
>
> For example:

``` js
// eslint.config.js
import { createOxcImportResolver, transformViteConfig } from 'eslint-import-resolver-oxc'
import viteConfig from './vite.config.js'

export default [
  {
    settings: {
      'import-x/resolver-next': [
        createOxcImportResolver({
          ...transformViteConfig(viteConfig)
        }),
      ]
    }
  }
]
```

#### others

The `jsconfig.json` and `tsconfig.json` in the root directory (`cwd`) will automatically detected.

More options see [oxc-resolver](https://github.com/oxc-project/oxc-resolver?tab=readme-ov-file#options)

## Who is using?

- [`Rel1cx/eslint-react`](https://github.com/Rel1cx/eslint-react) - A series of composable ESLint rules for libraries and frameworks that use React as a UI runtime.
- [`SocketDev/socket-cli`](https://github.com/SocketDev/socket-cli) - Next-gen SCA + SBOM + 0-day prevention.

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
