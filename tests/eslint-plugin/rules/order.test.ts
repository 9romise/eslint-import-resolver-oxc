import type { NapiResolveOptions } from 'oxc-resolver'
import { oxcResolver, run, testFilePath } from '../utils'

run({
  rule: 'order',
  valid: [
    {
      code: `
        import _ from 'lodash';
        import m from '@test-scope/some-module';

        import bar from './bar';
      `,
      options: [
        {
          'newlines-between': 'always',
        },
      ],
      settings: {
        'import-x/external-module-folders': [
          'node_modules',
          'symlinked-module',
        ],
      },
    },
    {
      code: `
        import fs from 'fs';

        import express from 'express';

        import service from '@/api/service';

        import fooParent from '../foo';

        import fooSibling from './foo';

        import index from './';

        import internalDoesNotExistSoIsUnknown from '@/does-not-exist';
      `,
      options: [
        {
          'groups': [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
            'unknown',
          ],
          'newlines-between': 'always',
        },
      ],
      settings: {
        'import-x/resolver': {
          [oxcResolver]: {
            alias: {
              '@': [testFilePath('internal-modules')],
            },
          } satisfies NapiResolveOptions,
        },
      },
    },
  ],
})

run({
  rule: 'order',
  lang: 'ts',
  valid: [
    // Option alphabetize: {order: 'asc'}
    {
      code: `
          import c from 'Bar';
          import type { C } from 'Bar';
          import b from 'bar';
          import a from 'foo';
          import type { A } from 'foo';

          import index from './';
        `,
      options: [
        {
          groups: ['external', 'index'],
          alphabetize: { order: 'asc' },
        },
      ],
    },
    // Option alphabetize: {order: 'desc'}
    {
      code: `
          import a from 'foo';
          import type { A } from 'foo';
          import b from 'bar';
          import c from 'Bar';
          import type { C } from 'Bar';

          import index from './';
        `,
      options: [
        {
          groups: ['external', 'index'],
          alphabetize: { order: 'desc' },
        },
      ],
    },
    // Option alphabetize: {order: 'asc'} with type group
    {
      code: `
          import c from 'Bar';
          import b from 'bar';
          import a from 'foo';

          import index from './';

          import type { C } from 'Bar';
          import type { A } from 'foo';
        `,
      options: [
        {
          groups: ['external', 'index', 'type'],
          alphabetize: { order: 'asc' },
        },
      ],
    },
    // Option alphabetize: {order: 'asc'} with type group & path group
    {
      // only: true,
      code: `
          import c from 'Bar';
          import a from 'foo';

          import b from 'dirA/bar';

          import index from './';

          import type { C } from 'dirA/Bar';
          import type { A } from 'foo';
        `,
      options: [
        {
          'alphabetize': { order: 'asc' },
          'groups': ['external', 'internal', 'index', 'type'],
          'pathGroups': [
            {
              pattern: 'dirA/**',
              group: 'internal',
            },
          ],
          'newlines-between': 'always',
          'pathGroupsExcludedImportTypes': ['type'],
        },
      ],
    },
    // Option alphabetize: {order: 'asc'} with path group
    {
      // only: true,
      code: `
          import c from 'Bar';
          import type { A } from 'foo';
          import a from 'foo';

          import type { C } from 'dirA/Bar';
          import b from 'dirA/bar';

          import index from './';
        `,
      options: [
        {
          'alphabetize': { order: 'asc' },
          'groups': ['external', 'internal', 'index'],
          'pathGroups': [
            {
              pattern: 'dirA/**',
              group: 'internal',
            },
          ],
          'newlines-between': 'always',
          'pathGroupsExcludedImportTypes': [],
        },
      ],
    },
    // Option alphabetize: {order: 'desc'} with type group
    {
      code: `
          import a from 'foo';
          import b from 'bar';
          import c from 'Bar';

          import index from './';

          import type { A } from 'foo';
          import type { C } from 'Bar';
        `,
      options: [
        {
          groups: ['external', 'index', 'type'],
          alphabetize: { order: 'desc' },
        },
      ],
    },
    {
      code: `
          import { Partner } from '@models/partner/partner';
          import { PartnerId } from '@models/partner/partner-id';
        `,
      options: [
        {
          alphabetize: { order: 'asc' },
        },
      ],
    },
    {
      code: `
          import { serialize, parse, mapFieldErrors } from '@vtaits/form-schema';
          import type { GetFieldSchema } from '@vtaits/form-schema';
          import { useMemo, useCallback } from 'react';
          import type { ReactElement, ReactNode } from 'react';
          import { Form } from 'react-final-form';
          import type { FormProps as FinalFormProps } from 'react-final-form';
        `,
      options: [
        {
          alphabetize: { order: 'asc' },
        },
      ],
    },
    // Imports inside module declaration
    {
      code: `
          import type { CopyOptions } from 'fs';
          import type { ParsedPath } from 'path';

          declare module 'my-module' {
            import type { CopyOptions } from 'fs';
            import type { ParsedPath } from 'path';
          }
        `,
      options: [
        {
          alphabetize: { order: 'asc' },
        },
      ],
    },
    {
      code: `
          import { useLazyQuery, useQuery } from "@apollo/client";
          import { useEffect } from "react";
        `,
      options: [
        {
          'groups': [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
            'object',
            'type',
          ],
          'pathGroups': [
            {
              pattern: 'react',
              group: 'external',
              position: 'before',
            },
          ],
          'newlines-between': 'always',
          'alphabetize': {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
    },
    {
      code: `
      import express from 'express';
      import log4js from 'log4js';
      import chpro from 'node:child_process';
      // import fsp from 'node:fs/promises';
    `,
      options: [
        {
          groups: [
            [
              'builtin',
              'external',
              'internal',
              'parent',
              'sibling',
              'index',
              'object',
              'type',
            ],
          ],
        },
      ],
    },
  ],
  invalid: [
    // Option alphabetize: {order: 'asc'}
    {
      code: `
          import b from 'bar';
          import c from 'Bar';
          import type { C } from 'Bar';
          import a from 'foo';
          import type { A } from 'foo';

          import index from './';
        `,
      output: `
          import c from 'Bar';
          import type { C } from 'Bar';
          import b from 'bar';
          import a from 'foo';
          import type { A } from 'foo';

          import index from './';
        `,
      options: [
        {
          groups: ['external', 'index'],
          alphabetize: { order: 'asc' },
        },
      ],
      errors: [
        {
          // @ts-expect-error maybe upstream
          message: /(`bar` import should occur after type import of `Bar`)|(`Bar` type import should occur before import of `bar`)/,
        },
      ],
    },
    // Option alphabetize: {order: 'desc'}
    {
      code: `
          import a from 'foo';
          import type { A } from 'foo';
          import c from 'Bar';
          import type { C } from 'Bar';
          import b from 'bar';

          import index from './';
        `,
      output: `
          import a from 'foo';
          import type { A } from 'foo';
          import b from 'bar';
          import c from 'Bar';
          import type { C } from 'Bar';

          import index from './';
        `,
      options: [
        {
          groups: ['external', 'index'],
          alphabetize: { order: 'desc' },
        },
      ],
      errors: [
        {
          // @ts-expect-error maybe upstream
          message: /(`bar` import should occur before import of `Bar`)|(`Bar` import should occur after import of `bar`)/,
        },
      ],
    },
    // Option alphabetize: {order: 'asc'} with type group
    {
      code: `
          import b from 'bar';
          import c from 'Bar';
          import a from 'foo';

          import index from './';

          import type { A } from 'foo';
          import type { C } from 'Bar';
        `,
      output: `
          import c from 'Bar';
          import b from 'bar';
          import a from 'foo';

          import index from './';

          import type { C } from 'Bar';
          import type { A } from 'foo';
        `,
      options: [
        {
          groups: ['external', 'index', 'type'],
          alphabetize: { order: 'asc' },
        },
      ],
      errors: [
        {
          // @ts-expect-error maybe upstream
          message: /(`Bar` import should occur before import of `bar`)|(`bar` import should occur after import of `Bar`)/,
        },
        {
          // @ts-expect-error maybe upstream
          message: /(`Bar` type import should occur before type import of `foo`)|(`foo` type import should occur after type import of `Bar`)/,
        },
      ],
    },
    // Option alphabetize: {order: 'desc'} with type group
    {
      code: `
          import a from 'foo';
          import c from 'Bar';
          import b from 'bar';

          import index from './';

          import type { C } from 'Bar';
          import type { A } from 'foo';
        `,
      output: `
          import a from 'foo';
          import b from 'bar';
          import c from 'Bar';

          import index from './';

          import type { A } from 'foo';
          import type { C } from 'Bar';
        `,
      options: [
        {
          groups: ['external', 'index', 'type'],
          alphabetize: { order: 'desc' },
        },
      ],
      errors: [
        {
          // @ts-expect-error maybe upstream
          message: /(`bar` import should occur before import of `Bar`)|(`Bar` import should occur after import of `bar`)/,
        },
        {
          // @ts-expect-error maybe upstream
          message: /(`foo` type import should occur before type import of `Bar`)|(`Bar` type import should occur after import of type `foo`)/,
        },
      ],
    },
    // warns for out of order unassigned imports (warnOnUnassignedImports enabled)
    {
      code: `
          import './local1';
          import global from 'global1';
          import local from './local2';
          import 'global2';
        `,
      errors: [
        {
          message:
            '`global1` import should occur before import of `./local1`',
        },
        {
          message:
            '`global2` import should occur before import of `./local1`',
        },
      ],
      options: [{ warnOnUnassignedImports: true }],
    },
    // fix cannot move below unassigned import (warnOnUnassignedImports enabled)
    {
      code: `
          import local from './local';

          import 'global1';

          import global2 from 'global2';
          import global3 from 'global3';
        `,
      errors: [
        {
          message:
            '`./local` import should occur after import of `global3`',
        },
      ],
      options: [{ warnOnUnassignedImports: true }],
    },
    // Imports inside module declaration
    {
      code: `
          import type { ParsedPath } from 'path';
          import type { CopyOptions } from 'fs';

          declare module 'my-module' {
            import type { ParsedPath } from 'path';
            import type { CopyOptions } from 'fs';
          }
        `,
      output: `
          import type { CopyOptions } from 'fs';
          import type { ParsedPath } from 'path';

          declare module 'my-module' {
            import type { CopyOptions } from 'fs';
            import type { ParsedPath } from 'path';
          }
        `,
      errors: [
        {
          message:
            '`fs` type import should occur before type import of `path`',
        },
        {
          message:
            '`fs` type import should occur before type import of `path`',
        },
      ],
      options: [
        {
          alphabetize: { order: 'asc' },
        },
      ],
    },

    {
      code: `
      import express from 'express';
      import log4js from 'log4js';
      import chpro from 'node:child_process';
      // import fsp from 'node:fs/promises';
    `,
      output: `
      import chpro from 'node:child_process';
      import express from 'express';
      import log4js from 'log4js';
      // import fsp from 'node:fs/promises';
    `,
      options: [
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
            'object',
            'type',
          ],
        },
      ],
      errors: [
        {
          message:
            '`node:child_process` import should occur before import of `express`',
        },
        // { message: '`node:fs/promises` import should occur before import of `express`' },
      ],
    },
  ],
})
