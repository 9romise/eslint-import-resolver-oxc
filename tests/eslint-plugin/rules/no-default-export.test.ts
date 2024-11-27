import { run } from '../utils'

run({
  rule: 'no-default-export',
  lang: 'ts',
  invalid: [
    {
      code: 'function foo() { return \'foo\'; }\nexport default foo;',
      filename: 'foo.ts',
      errors: [
        {
          type: 'ExportDefaultDeclaration',
          messageId: 'preferNamed',
        },
      ],
      languageOptions: {
        parserOptions: {
          ecmaversion: 'latest',
          sourceType: 'module',
        },
      },
    },
  ],
})
