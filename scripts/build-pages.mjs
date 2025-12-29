import { promises as fs } from 'node:fs'
import path from 'node:path'

const rootDir = process.cwd()
const projectsDir = path.join(rootDir, 'projects')
const outDir = path.join(rootDir, 'pages-dist')

async function exists(p) {
  try {
    await fs.access(p)
    return true
  } catch {
    return false
  }
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (c) => {
    switch (c) {
      case '&':
        return '&amp;'
      case '<':
        return '&lt;'
      case '>':
        return '&gt;'
      case '"':
        return '&quot;'
      case "'":
        return '&#39;'
      default:
        return c
    }
  })
}

async function main() {
  if (!(await exists(projectsDir))) {
    throw new Error(`No projects directory: ${projectsDir}`)
  }

  await fs.rm(outDir, { recursive: true, force: true })
  await fs.mkdir(outDir, { recursive: true })

  const dirents = await fs.readdir(projectsDir, { withFileTypes: true })
  const projectNames = dirents
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort((a, b) => a.localeCompare(b))

  const published = []

  for (const name of projectNames) {
    const distDir = path.join(projectsDir, name, 'dist')
    const distIndex = path.join(distDir, 'index.html')
    if (!(await exists(distIndex))) continue

    const targetDir = path.join(outDir, name)
    await fs.mkdir(targetDir, { recursive: true })
    await fs.cp(distDir, targetDir, { recursive: true })
    published.push(name)
  }

  const now = new Date().toISOString()
  const items = published
    .map((name) => {
      const safe = escapeHtml(name)
      return `<li><a href="./${encodeURIComponent(name)}/">${safe}</a></li>`
    })
    .join('\n')

  const indexHtml = `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vibe-idea Projects</title>
    <style>
      :root { color-scheme: light dark; }
      body { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; max-width: 820px; margin: 40px auto; padding: 0 16px; }
      header { margin-bottom: 16px; }
      h1 { font-size: 20px; margin: 0 0 8px; }
      p { margin: 0 0 12px; opacity: 0.8; }
      ul { margin: 0; padding-left: 18px; }
      li { margin: 8px 0; }
      a { text-decoration: none; }
      a:hover { text-decoration: underline; }
      code { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; font-size: 0.95em; }
      .meta { margin-top: 18px; font-size: 12px; opacity: 0.7; }
    </style>
  </head>
  <body>
    <header>
      <h1>Projects</h1>
      <p>这是仓库 <code>projects/*</code> 下可发布的静态站点入口。</p>
    </header>
    <main>
      <ul>
        ${items || '<li>暂无可发布项目（未找到 projects/*/dist/index.html）</li>'}
      </ul>
      <div class="meta">Generated at ${escapeHtml(now)}</div>
    </main>
  </body>
</html>
`

  await fs.writeFile(path.join(outDir, 'index.html'), indexHtml, 'utf8')
  console.log(`[pages] published: ${published.length ? published.join(', ') : '(none)'}`)
  console.log(`[pages] outDir: ${outDir}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})


