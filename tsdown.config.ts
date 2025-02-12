import type { Config } from 'tsdown'
import { resolve } from 'node:path'
import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  clean: true,
  platform: 'node',
  shims: true,
  dts: { transformer: 'oxc' },
  alias: {
    '~': resolve('src'),
  },
  bundleDts: true,
}) as Config
