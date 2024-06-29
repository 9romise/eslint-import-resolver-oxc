# eslint-import-resolver-oxc

[![npm version][npm-version-src]][npm-version-href][![License][license-src]][license-href]

A resolver based on [oxc-resolver](https://github.com/oxc-project/oxc-resolver) for [eslint-plugin-import-x](https://github.com/un-ts/eslint-plugin-import-x)

## Install

```bash
npm install eslint-import-resolver-oxc --save-dev
```

## Usage

Inside your `eslint.config.js`, pass the resolver to `eslint-plugin-import-x`:

```json
{
  "settings": {
    "import-x/resolver": {
      "oxc": true
    }
  }
}
```

This lib defaults to ESM, if you use CJS(not recommended), please wait for the subsequent release. Or you can configure it yourself according to the [documentation](https://github.com/oxc-project/oxc-resolver?tab=readme-ov-file#options).

### Options

see [oxc-resolver](https://github.com/oxc-project/oxc-resolver?tab=readme-ov-file#options)

## License

[MIT](./LICENSE) License &copy; 2024-PRESENT [Vida Xie](https://github.com/9romise)

[npm-version-src]: https://img.shields.io/npm/v/eslint-import-resolver-oxc
[npm-version-href]: https://npmjs.com/package/eslint-import-resolver-oxc
[license-src]: https://img.shields.io/npm/l/eslint-import-resolver-oxc
[license-href]: https://opensource.org/licenses/MIT
