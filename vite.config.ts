/// <reference types="vitest" />
import path from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      name: 'aajs',
      entry: path.resolve(__dirname, 'src/index.ts'),
      fileName: (format) => `aa.${format}.js`
    }
  },
  test: {
    globals: true
  }
})
