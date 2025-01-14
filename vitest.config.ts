import { resolve } from 'node:path'
import { cwd } from 'node:process'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts'],
    alias: {
      '@': resolve(cwd(), 'src'),
    },
  },
})
