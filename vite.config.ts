/// <reference types="vitest" />
// @ts-ignore
import path from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
// import { fileURLToPath } from 'url'

export default defineConfig({
  build: {
    lib: {
      name: 'aa-js',
      entry: path.resolve(__dirname, 'src/index.ts'),
      fileName: 'aa-js'
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
    alias: {
      '@': path.resolve(__dirname, './src')
    },
    // alias: {
    // @ts-ignore
    // '@': fileURLToPath(new URL('src/', import.meta.url)),
    // @ts-ignore
    // '#': fileURLToPath(new URL('tests/', import.meta.url)),
    // },
    dedupe: [
      'vue',
      'lodash',
      'dayjs',
    ],
  },
  test: {
    globals: true
  }
})

