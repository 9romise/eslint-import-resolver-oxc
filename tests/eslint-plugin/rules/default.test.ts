import { run, testFilePath } from '../utils'

run({
  rule: 'default',
  lang: 'ts',
  valid: [
    `import foobar from "./typescript-default"`,
    `import foobar from "./typescript-export-assign-default"`,
    `import foobar from "./typescript-export-assign-function"`,
    `import foobar from "./typescript-export-assign-mixed"`,
    `import foobar from "./typescript-export-assign-default-reexport"`,
    {
      code: `import React from "./typescript-export-assign-default-namespace"`,
      languageOptions: {
        parserOptions: {
          tsconfigRootDir: testFilePath('typescript-export-assign-default-namespace'),
        },
      },
    },
    {
      code: `import Foo from "./typescript-export-as-default-namespace"`,
      languageOptions: {
        parserOptions: {
          tsconfigRootDir: testFilePath('typescript-export-as-default-namespace'),
        },
      },
    },
    {
      code: `import Foo from "./typescript-export-react-test-renderer"`,
      languageOptions: {
        parserOptions: {
          tsconfigRootDir: testFilePath('typescript-export-react-test-renderer'),
        },
      },
    },
    {
      code: `import Foo from "./typescript-extended-config"`,
      languageOptions: {
        parserOptions: {
          tsconfigRootDir: testFilePath('typescript-extended-config'),
        },
      },
    },
    'import foobar from "./typescript-export-assign-property"',
  ],
  invalid: [
    {
      code: `import foobar from "./typescript"`,
      errors: [
        { message: 'No default export found in imported module "./typescript".' },
      ],
    },
    {
      code: `import React from "./typescript-export-assign-default-namespace"`,
      errors: [
        { message: 'No default export found in imported module "./typescript-export-assign-default-namespace".' },
      ],
    },
    {
      code: `import FooBar from "./typescript-export-as-default-namespace"`,
      errors: [
        { message: 'No default export found in imported module "./typescript-export-as-default-namespace".' },
      ],
    },
    {
      code: `import Foo from "./typescript-export-as-default-namespace"`,
      languageOptions: {
        parserOptions: {
          tsconfigRootDir: testFilePath('typescript-no-compiler-options'),
        },
      },
      errors: [
        {
          message:
            'No default export found in imported module "./typescript-export-as-default-namespace".',
          line: 1,
          column: 8,
          endLine: 1,
          endColumn: 11,
        },
      ],
    },
  ],
})
