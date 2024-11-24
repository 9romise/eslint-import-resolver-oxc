import { run } from '../utils'

run({
  rule: 'namespace',
  lang: 'ts',
  valid: [
    `
      import * as foo from "./typescript-declare-nested"
      foo.bar.MyFunction()
    `,
    `import { foobar } from "./typescript-declare-interface"`,
    'export * from "typescript/lib/typescript.d"',
    'export = function name() {}',
  ],
})
