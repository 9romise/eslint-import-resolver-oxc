import { run } from '../utils'

function createError(messageId: string, module: string, type?: string) {
  return { messageId, data: { module }, type }
}

run({
  rule: 'no-unresolved',
  valid: [
    { code: 'import "./malformed.js"' },
    { code: 'import foo from "./bar";' },
    { code: 'import bar from \'./bar.js\';' },
    // { code: 'import {someThing} from \'./test-module\';' },
    { code: 'import fs from \'fs\';' },
    {
      code: 'import(\'fs\');',
      languageOptions: {
        parserOptions: { ecmaVersion: 2021 },
      },
    },
    { code: 'import * as foo from "vitest"' },
    { code: 'export { foo } from "./bar"' },
    { code: 'export * from "./bar"' },
    { code: 'let foo; export { foo }' },
    // stage 1 proposal for export symmetry,
    { code: 'export * as bar from "./bar"' },
    // { code: 'export bar from "./bar"' }, // Declaration or statement expected.
    { code: 'import foo from "./jsx/MyUnCoolComponent.jsx"' },
    // commonjs setting
    {
      code: 'var foo = require("./bar")',
      options: [{ commonjs: true }],
    },
    {
      code: 'require("./bar")',
      options: [{ commonjs: true }],
    },
    {
      code: 'require("./does-not-exist")',
      options: [{ commonjs: false }],
    },
    { code: 'require("./does-not-exist")' },

    // amd setting
    {
      code: 'require(["./bar"], function (bar) {})',
      options: [{ amd: true }],
    },
    {
      code: 'define(["./bar"], function (bar) {})',
      options: [{ amd: true }],
    },
    {
      code: 'require(["./does-not-exist"], function (bar) {})',
      options: [{ amd: false }],
    },
    // magic modules: https://github.com/requirejs/requirejs/wiki/Differences-between-the-simplified-CommonJS-wrapper-and-standard-AMD-define#magic-modules
    {
      code: 'define(["require", "exports", "module"], function (r, e, m) { })',
      options: [{ amd: true }],
    },
    // don't validate without callback param
    {
      code: 'require(["./does-not-exist"])',
      options: [{ amd: true }],
    },
    { code: 'define(["./does-not-exist"], function (bar) {})' },
    // stress tests
    {
      code: 'require("./does-not-exist", "another arg")',
      options: [{ commonjs: true, amd: true }],
    },
    {
      code: 'proxyquire("./does-not-exist")',
      options: [{ commonjs: true, amd: true }],
    },
    {
      code: '(function() {})("./does-not-exist")',
      options: [{ commonjs: true, amd: true }],
    },
    {
      code: 'define([0, foo], function (bar) {})',
      options: [{ amd: true }],
    },
    {
      code: 'require(0)',
      options: [{ commonjs: true }],
    },
    {
      code: 'require(foo)',
      options: [{ commonjs: true }],
    },
  ],

  invalid: [
    {
      code: 'import reallyfake from "./reallyfake/module"',
      settings: { 'import-x/ignore': [String.raw`^\./fake/`] },
      errors: [createError('unresolved', './reallyfake/module', 'Literal')],
    },
    {
      code: 'import bar from \'./baz\';',
      errors: [createError('unresolved', './baz', 'Literal')],
    },
    {
      code: 'import bar from \'./empty-folder\';',
      errors: [createError('unresolved', './empty-folder', 'Literal')],
    },
    // sanity check that this module is _not_ found without proper settings
    {
      code: 'import { DEEP } from \'in-alternate-root\';',
      errors: [createError('unresolved', 'in-alternate-root', 'Literal')],
    },
    {
      code: 'import(\'in-alternate-root\').then(function({DEEP}) {});',
      errors: [createError('unresolved', 'in-alternate-root', 'Literal')],
    },
    {
      code: 'export { foo } from "./does-not-exist"',
      errors: [createError('unresolved', './does-not-exist', 'Literal')],
    },
    {
      code: 'export * from "./does-not-exist"',
      errors: [createError('unresolved', './does-not-exist', 'Literal')],
    },
    // check with eslint parser
    {
      code: 'import(\'in-alternate-root\').then(function({DEEP}) {});',
      errors: [createError('unresolved', 'in-alternate-root', 'Literal')],
      languageOptions: {
        parserOptions: { ecmaVersion: 2021 },
      },
    },
    // export symmetry proposal
    {
      code: 'export * as bar from "./does-not-exist"',
      errors: [createError('unresolved', './does-not-exist', 'Literal')],
    },
    // {
    //   code: 'export bar from "./does-not-exist"', // Declaration or statement expected.
    //   errors: [createError('unresolved', './does-not-exist', 'Literal')],
    // },

    // commonjs setting
    {
      code: 'var bar = require("./baz")',
      options: [{ commonjs: true }],
      errors: [createError('unresolved', './baz', 'Literal')],
    },
    {
      code: 'require("./baz")',
      options: [{ commonjs: true }],
      errors: [createError('unresolved', './baz', 'Literal')],
    },

    // amd
    {
      code: 'require(["./baz"], function (bar) {})',
      options: [{ amd: true }],
      errors: [createError('unresolved', './baz', 'Literal')],
    },
    {
      code: 'define(["./baz"], function (bar) {})',
      options: [{ amd: true }],
      errors: [createError('unresolved', './baz', 'Literal')],
    },
    {
      code: 'define(["./baz", "./bar", "./does-not-exist"], function (bar) {})',
      options: [{ amd: true }],
      errors: [
        createError('unresolved', './baz', 'Literal'),
        createError('unresolved', './does-not-exist', 'Literal'),
      ],
    },
  ],
})
