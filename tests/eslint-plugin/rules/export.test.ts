import { run, testFilePath } from '../utils'

run({
  rule: 'export',
  lang: 'ts',
  valid: [
    `
      export const Foo = 1;
      export type Foo = number;
    `,
    `
      export const Foo = 1;
      export interface Foo {}
    `,
    `
      export function fff(a: string);
      export function fff(a: number);
    `,
    `
      export function fff(a: string);
      export function fff(a: number);
      export function fff(a: string|number) {};
    `,
    // namespace
    `
      export const Bar = 1;
      export namespace Foo {
        export const Bar = 1;
      }
    `,
    `
      export type Bar = string;
      export namespace Foo {
        export type Bar = string;
      }
    `,
    `
      export const Bar = 1;
      export type Bar = string;
      export namespace Foo {
        export const Bar = 1;
        export type Bar = string;
      }
    `,
    `
      export namespace Foo {
        export const Foo = 1;
        export namespace Bar {
          export const Foo = 2;
        }
        export namespace Baz {
          export const Foo = 3;
        }
      }
    `,
    `
      export class Foo { }
      export namespace Foo { }
      export namespace Foo {
        export class Bar {}
      }
    `,
    `
      export function Foo();
      export namespace Foo { }
    `,
    `
      export function Foo(a: string);
      export namespace Foo { }
    `,
    `
      export function Foo(a: string);
      export function Foo(a: number);
      export namespace Foo { }
    `,
    `
      export enum Foo { }
      export namespace Foo { }
    `,
    {
      code: 'export * from "./file1.ts"',
      filename: testFilePath('typescript-d-ts/file-2.ts'),
    },
    `
      export * as A from './named-export-collision/a';
      export * as B from './named-export-collision/b';
    `,
    // Exports in ambient modules
    `
      declare module "a" {
        const Foo = 1;
        export {Foo as default};
      }
      declare module "b" {
        const Bar = 2;
        export {Bar as default};
      }
    `,
    `
      declare module "a" {
        const Foo = 1;
        export {Foo as default};
      }
      const Bar = 2;
      export {Bar as default};
    `,
    {
      code: `
        export * from './module';
      `,
      filename: testFilePath('export-star-4/index.js'),
      settings: {
        'import-x/extensions': ['.js', '.ts', '.jsx'],
      },
    },
  ],
  invalid: [
    // type/value name clash
    {
      code: `
        export type Foo = string;
        export type Foo = number;
      `,
      errors: [
        {
          message: `Multiple exports of name 'Foo'.`,
          line: 2,
        },
        {
          message: `Multiple exports of name 'Foo'.`,
          line: 3,
        },
      ],
    },
    // namespace
    {
      code: `
        export const a = 1
        export namespace Foo {
          export const a = 2;
          export const a = 3;
        }
      `,
      errors: [
        {
          message: `Multiple exports of name 'a'.`,
          line: 4,
        },
        {
          message: `Multiple exports of name 'a'.`,
          line: 5,
        },
      ],
    },
    {
      code: `
        declare module 'foo' {
          const Foo = 1;
          export default Foo;
          export default Foo;
        }
      `,
      errors: [
        {
          message: 'Multiple default exports.',
          line: 4,
        },
        {
          message: 'Multiple default exports.',
          line: 5,
        },
      ],
    },
    {
      code: `
        export namespace Foo {
          export namespace Bar {
            export const Foo = 1;
            export const Foo = 2;
          }
          export namespace Baz {
            export const Bar = 3;
            export const Bar = 4;
          }
        }
      `,
      errors: [
        {
          message: `Multiple exports of name 'Foo'.`,
          line: 4,
        },
        {
          message: `Multiple exports of name 'Foo'.`,
          line: 5,
        },
        {
          message: `Multiple exports of name 'Bar'.`,
          line: 8,
        },
        {
          message: `Multiple exports of name 'Bar'.`,
          line: 9,
        },
      ],
    },

    {
      code: `
          export class Foo { }
          export class Foo { }
          export namespace Foo { }
        `,
      errors: [
        {
          message: `Multiple exports of name 'Foo'.`,
          line: 2,
        },
        {
          message: `Multiple exports of name 'Foo'.`,
          line: 3,
        },
      ],
    },
    {
      code: `
          export enum Foo { }
          export enum Foo { }
          export namespace Foo { }
        `,
      errors: [
        {
          message: `Multiple exports of name 'Foo'.`,
          line: 2,
        },
        {
          message: `Multiple exports of name 'Foo'.`,
          line: 3,
        },
      ],
    },
    {
      code: `
          export enum Foo { }
          export class Foo { }
          export namespace Foo { }
        `,
      errors: [
        {
          message: `Multiple exports of name 'Foo'.`,
          line: 2,
        },
        {
          message: `Multiple exports of name 'Foo'.`,
          line: 3,
        },
      ],
    },
    {
      code: `
          export const Foo = 'bar';
          export class Foo { }
          export namespace Foo { }
        `,
      errors: [
        {
          message: `Multiple exports of name 'Foo'.`,
          line: 2,
        },
        {
          message: `Multiple exports of name 'Foo'.`,
          line: 3,
        },
      ],
    },
    {
      code: `
          export function Foo() { };
          export class Foo { }
          export namespace Foo { }
        `,
      errors: [
        {
          message: `Multiple exports of name 'Foo'.`,
          line: 2,
        },
        {
          message: `Multiple exports of name 'Foo'.`,
          line: 3,
        },
      ],
    },
    {
      code: `
          export const Foo = 'bar';
          export function Foo() { };
          export namespace Foo { }
        `,
      errors: [
        {
          message: `Multiple exports of name 'Foo'.`,
          line: 2,
        },
        {
          message: `Multiple exports of name 'Foo'.`,
          line: 3,
        },
      ],
    },
    {
      code: `
          export const Foo = 'bar';
          export namespace Foo { }
        `,
      errors: [
        {
          message: `Multiple exports of name 'Foo'.`,
          line: 2,
        },
        {
          message: `Multiple exports of name 'Foo'.`,
          line: 3,
        },
      ],
    },
    // Exports in ambient modules
    {
      code: `
        declare module "a" {
          const Foo = 1;
          export {Foo as default};
        }
        const Bar = 2;
        export {Bar as default};
        const Baz = 3;
        export {Baz as default};
      `,
      errors: [
        {
          message: 'Multiple default exports.',
          line: 7,
        },
        {
          message: 'Multiple default exports.',
          line: 9,
        },
      ],
    },
  ],
})
