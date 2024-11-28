import { run } from '../utils'

function createCycleSourceError(p: string) {
  return {
    message: `Dependency cycle via ${p}`,
  }
}

run({
  rule: 'no-cycle',
  defaultFilenames: {
    js: 'tests/eslint-plugin/fixtures/cycles/depth-zero.js',
    ts: 'tests/eslint-plugin/fixtures/cycles/depth-zero.js',
  },
  valid: [
    {
      code: 'import { foo } from "cycles/external/depth-one"',
      options: [{ ignoreExternal: true }],
      settings: {
        'import-x/external-module-folders': ['cycles/external'],
      },
    },
    {
      code: 'import { foo } from "./external-depth-two"',
      options: [{ ignoreExternal: true }],
      settings: {
        'import-x/external-module-folders': ['cycles/external'],
      },
    },
  ],
  invalid: [
    ...[{}, { allowUnsafeDynamicCyclicDependency: true }].flatMap((opts) => [
      {
        code: `import { foo } from "./es6/depth-one"`,
        options: [{ ...opts }],
        errors: [{ messageId: 'cycle' }],
      },
      {
        code: `import { foo } from "./es6/depth-one"`,
        options: [{ ...opts, maxDepth: 1 }],
        errors: [{ messageId: 'cycle' }],
      },
      {
        code: `const { foo } = require("./es6/depth-one")`,
        options: [{ ...opts, commonjs: true }],
        errors: [{ messageId: 'cycle' }],
      },
      {
        code: `require(["./es6/depth-one"], d1 => {})`,
        options: [{ ...opts, amd: true }],
        errors: [{ messageId: 'cycle' }],
      },
      {
        code: `define(["./es6/depth-one"], d1 => {})`,
        options: [{ ...opts, amd: true }],
        errors: [{ messageId: 'cycle' }],
      },
      {
        code: `import { foo } from "./es6/depth-one-reexport"`,
        options: [{ ...opts }],
        errors: [{ messageId: 'cycle' }],
      },
      {
        code: `import { foo } from "./es6/depth-two"`,
        options: [{ ...opts }],
        errors: [createCycleSourceError('./depth-one:1')],
      },
      {
        code: `import { foo } from "./es6/depth-two"`,
        options: [{ ...opts, maxDepth: 2 }],
        errors: [createCycleSourceError('./depth-one:1')],
      },
      {
        code: `const { foo } = require("./es6/depth-two")`,
        errors: [createCycleSourceError('./depth-one:1')],
        options: [{ ...opts, commonjs: true }],
      },
      {
        code: `import { two } from "./es6/depth-three-star"`,
        options: [{ ...opts }],
        errors: [createCycleSourceError('./depth-two:1=>./depth-one:1')],
      },
      {
        code: `import one, { two, three } from "./es6/depth-three-star"`,
        options: [{ ...opts }],
        errors: [createCycleSourceError('./depth-two:1=>./depth-one:1')],
      },
      {
        code: `import { bar } from "./es6/depth-three-indirect"`,
        options: [{ ...opts }],
        errors: [createCycleSourceError('./depth-two:1=>./depth-one:1')],
      },
      {
        code: `import { bar } from "./es6/depth-three-indirect"`,
        options: [{ ...opts }],
        errors: [createCycleSourceError('./depth-two:1=>./depth-one:1')],
      },
      {
        code: `import { foo } from "./es6/depth-two"`,
        options: [{ ...opts, maxDepth: Number.POSITIVE_INFINITY }],
        errors: [createCycleSourceError('./depth-one:1')],
      },
      {
        code: `import { foo } from "./es6/depth-two"`,
        options: [{ ...opts, maxDepth: '∞' }],
        errors: [createCycleSourceError('./depth-one:1')],
      },
    ]),

    // upstream
    // {
    //   code: 'import { foo } from "cycles/external/depth-one"',
    //   errors: [{ message: `Dependency cycle detected.` }],
    //   settings: {
    //     'import-x/external-module-folders': ['cycles/external'],
    //   },
    // },
    // {
    //   code: 'import { foo } from "./external-depth-two"',
    //   errors: [{ message: `Dependency cycle via cycles/external/depth-one:1` }],
    //   settings: {
    //     'import-x/external-module-folders': ['cycles/external'],
    //   },
    // },
  ],
})
