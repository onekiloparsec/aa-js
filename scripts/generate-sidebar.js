import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const apiDir = path.join(__dirname, '../docs/api')

// Define the desired order for root items
const rootOrder = ['index', 'modules', 'classes', 'interfaces', 'functions', 'variables', 'types', 'enums']

function buildSidebar (dir) {
  const items = []
  const list = fs.readdirSync(dir)

  // Sort the root items according to the desired order
  list.sort((a, b) => {
    const aIndex = rootOrder.indexOf(a)
    const bIndex = rootOrder.indexOf(b)
    // If both are in rootOrder, sort by their position
    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex
    // If only one is in rootOrder, it comes first
    if (aIndex !== -1) return -1
    if (bIndex !== -1) return 1
    // Otherwise, sort alphabetically
    return a.localeCompare(b)
  })

  list.forEach((item) => {
    const itemPath = path.join(dir, item)
    const stat = fs.statSync(itemPath)
    const relativePath = path.relative(apiDir, itemPath)

    if (stat.isDirectory()) {
      const subItems = buildSidebar(itemPath)
      if (subItems.length > 0) {
        items.push({
          text: item,
          collapsed: true,
          items: subItems,
        })
      }
    } else if (item.endsWith('.md')) {
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
