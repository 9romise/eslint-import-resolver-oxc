import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default {
  resolve: {
    alias: {
      '#test': path.resolve(__dirname, 'src'),
    }
  }
}