/// <reference types="vitest" />
import path from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'AA.js',
      fileName: (format) => `aa.${format}.js`
    }
  },
  test: {
    globals: true
  }
})
