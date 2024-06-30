import { fileURLToPath } from 'node:url'
// eslint-disable-next-line import/no-self-import
import { resolve } from '.'

const file = fileURLToPath(import.meta.url)

const res = resolve('.', file)

// eslint-disable-next-line no-console
console.log('res', res)
