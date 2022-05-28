/// <reference types="vitest" />
import path from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  build: {
    lib: {
      name: 'AA.js',
      entry: path.resolve(__dirname, 'src/index.ts'),
      formats: ['es', 'umd'],
      fileName: (format) => `aajs.${format}.js`
    }
  },
  plugins: [dts({
      include: ['src/index.ts', 'src/**/*.ts'],
      beforeWriteFile: (filePath, content) => ({
        filePath: filePath.replace('/src', ''),
        content
      })
    }
  )],
  resolve: {
    dedupe: ['vue']
  },
  test: {
    globals: true
  }
})
