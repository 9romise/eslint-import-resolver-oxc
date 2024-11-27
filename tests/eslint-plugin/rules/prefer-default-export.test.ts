import { run } from '../utils'

run({
  rule: 'prefer-default-export',
  lang: 'ts',
  valid: [
    {
      code: `
        export type foo = string;
        export type bar = number;
      `,
    },
    {
      code: `export type foo = string`,
    },
    {
      code: `export interface foo { bar: string; }`,
    },
    {
      code: `export interface foo { bar: string; }; export function goo() {}`,
    },
  ],
})
