/// <reference types="vitest" />
const path = require('path')
const { defineConfig } = require('vite')

module.exports = defineConfig({
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
