import type { InvalidTestCase, ValidTestCase } from '../utils'
import { run, testFilePath } from '../utils'

const valid: ValidTestCase[] = [
  {
    code: `import x from './typescript-export-assign-object'`,
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: testFilePath('typescript-export-assign-object'),
      },
    },
  },
]

const invalid: InvalidTestCase[] = [
  {
    code: `import { NotExported } from './typescript-export-assign-object'`,
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: testFilePath('typescript-export-assign-object'),
      },
    },
    errors: [
      {
        message: `NotExported not found in './typescript-export-assign-object'`,
        type: 'Identifier',
      },
    ],
  },
  {
    // `export =` syntax creates a default export only
    code: `import { FooBar } from './typescript-export-assign-object'`,
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: testFilePath('typescript-export-assign-object'),
      },
    },
    errors: [
      {
        message: `FooBar not found in './typescript-export-assign-object'`,
        type: 'Identifier',
      },
    ],
  },
]

for (const source of [
  'typescript',
  'typescript-declare',
  'typescript-export-assign-namespace',
  'typescript-export-assign-namespace-merged',
]) {
  valid.push(
    `import { MyType } from "./${source}"`,
    `import { Foo } from "./${source}"`,
    `import { Bar } from "./${source}"`,
    `import { getFoo } from "./${source}"`,
    `
      import { MyModule } from "./${source}"
      MyModule.ModuleFunction()
    `,
    `
      import { MyNamespace } from "./${source}"
      MyNamespace.NSModule.NSModuleFunction()
    `,
  )

  invalid.push(
    {
      code: `import { MissingType } from "./${source}"`,
      errors: [
        {
          message: `MissingType not found in './${source}'`,
          type: 'Identifier',
        },
      ],
    },
    {
      code: `import { NotExported } from "./${source}"`,
      errors: [
        {
          message: `NotExported not found in './${source}'`,
          type: 'Identifier',
        },
      ],
    },
  )
}

run({
  rule: 'named',
  lang: 'ts',
  valid,
  invalid,
})
