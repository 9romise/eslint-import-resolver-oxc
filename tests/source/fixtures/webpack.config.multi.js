import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default [
  {
    name: 'alias',
    resolve: {
      alias: {
        '#test': path.resolve(__dirname, 'src'),
      },
    },
  },
  {
    name: 'extensions',
    resolve: {
      extensions: ['.ts', '.js'],
    },
  },
  {
    name: 'empty',
  },
]
