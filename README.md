# eslint-import-resolver-oxc

[![npm version][npm-version-src]][npm-version-href] [![License][license-src]][license-href]

A simply wrapped [`oxc-resolver`](https://github.com/oxc-project/oxc-resolver) for [`eslint-plugin-import-x`](https://github.com/un-ts/eslint-plugin-import-x) and [`eslint-plugin-import`](https://github.com/import-js/eslint-plugin-import).

## Installation

```bash
npm install eslint-import-resolver-oxc --save-dev
```

## Usage

Pass the resolver to `eslint-plugin-import-x` or `eslint-plugin-import` in your `eslint.config.js`.

For `eslint-plugin-import-x`:
```json
{
  "settings": {
    "import-x/resolver": "oxc"
  }
}
```
or
```json
{
  "settings": {
    "import-x/resolver": {
      "oxc": true
    }
  }
}
```
or
```json
{
  "settings": {
    "import-x/resolver": {
      "oxc": {
        // resolver options...
      }
    }
  }
}
```

For `eslint-plugin-import`:

Replace `import-x/resolver` with `import/resolver` in the object above.

### Options

Default options see [normalizeOptions.ts](./src/normalizeOptions.ts)

More info see [oxc-resolver](https://github.com/oxc-project/oxc-resolver?tab=readme-ov-file#options)

If you use `TypeScript`, you can set `tsconfig.configFile` to specify the path of `tsconfig.json`. If there is a `tsconfig.json` in the root of your workspace, it will be set automatically by default.

## Motivation

Eslint is a bit slow in large projects. While I [track the performance of the rules](https://eslint.org/docs/latest/extend/custom-rules#profile-rule-performance), I found that `eslint-plugin-import-x` took a lot of time. I thought change a resolver might bring some improvements.

## Thanks

I can't finish the project without the help of [`oxc-resolver`](https://github.com/oxc-project/oxc-resolver).

Thanks [@Boshen](https://github.com/Boshen) for his work on [`oxc-resolver`](https://github.com/oxc-project/oxc-resolver).

## License

[MIT](./LICENSE) License &copy; 2024-PRESENT [Vida Xie](https://github.com/9romise)

[npm-version-src]: https://img.shields.io/npm/v/eslint-import-resolver-oxc?color=91ede9
[npm-version-href]: https://npmjs.com/package/eslint-import-resolver-oxc
[license-src]: https://img.shields.io/npm/l/eslint-import-resolver-oxc?color=91ede9
[license-href]: https://opensource.org/licenses/MIT
[oxc-resolver-link]: [`oxc-resolver`](https://github.com/oxc-project/oxc-resolver)
