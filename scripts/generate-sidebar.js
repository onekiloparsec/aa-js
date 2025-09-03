import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const apiDir = path.join(__dirname, '../docs/api')

function buildSidebar (dir) {
  const items = []
  const list = fs.readdirSync(dir)

  list.forEach((item) => {
    const itemPath = path.join(dir, item)
    const stat = fs.statSync(itemPath)
    const relativePath = path.relative(apiDir, itemPath)

    if (stat.isDirectory()) {
      // Recursively build sidebar for subdirectories
      const subItems = buildSidebar(itemPath)
      if (subItems.length > 0) {
        items.push({
          text: item,
          collapsed: true,
          items: subItems,
        })
      }
    } else if (item.endsWith('.md')) {
      // Add Markdown files as links
      items.push({
        text: item.replace('.md', ''),
        link: `/api/${relativePath.replace('.md', '')}`,
      })
    }
  })

  return items
}

try {
  const sidebarItems = buildSidebar(apiDir)
  const outputPath = path.join(__dirname, '../.vitepress/sidebar-api.json')
  fs.writeFileSync(outputPath, JSON.stringify(sidebarItems, null, 2))
  console.log('Sidebar generated successfully!')
} catch (err) {
  console.error('Error generating sidebar:', err)
}