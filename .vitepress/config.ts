import { defineConfig } from 'vitepress'
import apiSidebar from './sidebar-api.json'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'aa-js',
  description: 'Astronomical Algorithms in Javascript',
  base: "/aa-js/", // Only needed if deploying to GitHub Pages
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/' },
      { text: 'API', link: '/api/' }
    ],
    sidebar: {
      '/guide/': [
        { text: 'Getting Started', link: '/guide/' }
      ],
      '/api/': apiSidebar
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/onekiloparsec/aa-js' }
    ]
  },
  srcDir: './docs',
  cleanUrls: true,
})
