import path from 'node:path';

export default {
  resolve: {
    alias: {
      '#test': path.resolve(import.meta.dirname, 'src'),
    }
  }
}