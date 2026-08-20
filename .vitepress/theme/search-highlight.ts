import { useRouter } from 'vitepress'

const STORAGE_KEY = 'vp_search_query'

// 清除上一次的高亮，恢复原始文本
function clearMarks() {
  document.querySelectorAll('mark.search-hit').forEach((mark) => {
    const parent = mark.parentNode
    if (!parent) return
    parent.replaceChild(document.createTextNode(mark.textContent || ''), mark)
    parent.normalize()
  })
}

// 在正文 .vp-doc 中高亮指定关键词，并滚动到第一个匹配处
function highlightTerm(term: string) {
  clearMarks()
  const root = document.querySelector<HTMLElement>('.vp-doc')
  if (!root || !term.trim()) return
  const text = term.trim()

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement
      if (!parent) return NodeFilter.FILTER_REJECT
      const tag = parent.tagName
      // 跳过脚本/样式/代码块，避免破坏结构或高亮无意义内容
      if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'CODE' || tag === 'PRE') {
        return NodeFilter.FILTER_REJECT
      }
      // 不在链接/按钮内部高亮
      if (parent.closest('a, button')) return NodeFilter.FILTER_REJECT
      if (!node.nodeValue || !node.nodeValue.includes(text)) {
        return NodeFilter.FILTER_REJECT
      }
      return NodeFilter.FILTER_ACCEPT
    },
  })

  const targets: Text[] = []
  let current: Node | null
  while ((current = walker.nextNode())) {
    targets.push(current as Text)
  }

  targets.forEach((node) => {
    const value = node.nodeValue || ''
    const idx = value.indexOf(text)
    if (idx === -1) return
    const range = document.createRange()
    range.setStart(node, idx)
    range.setEnd(node, idx + text.length)
    const mark = document.createElement('mark')
    mark.className = 'search-hit'
    try {
      range.surroundContents(mark)
    } catch {
      // 极少数情况下 range 跨节点会抛错，忽略即可
    }
  })

  const first = root.querySelector('mark.search-hit')
  if (first) {
    // 稍等片刻，避免与 VitePress 自带滚动到锚点打架
    setTimeout(() => {
      first.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 150)
  }
}

// 等待正文渲染完成再高亮（路由切换后 DOM 可能尚未挂载）
function waitForContent(cb: () => void, tries = 25) {
  const root = document.querySelector('.vp-doc')
  if (root && root.children.length > 0) {
    cb()
    return
  }
  if (tries <= 0) return
  setTimeout(() => waitForContent(cb, tries - 1), 100)
}

export function setupSearchHighlight() {
  // 仅在浏览器端执行，避免服务端渲染（SSR）时访问 document 报错
  if (typeof document === 'undefined') return

  // 鼠标点击搜索结果时，记录当前搜索词
  document.addEventListener(
    'click',
    (e) => {
      const target = e.target as HTMLElement
      const link = target.closest('a.result')
      if (link && link.closest('.VPLocalSearchBox')) {
        const input = document.querySelector(
          '.VPLocalSearchBox .search-input',
        ) as HTMLInputElement | null
        const q = input?.value?.trim()
        if (q) sessionStorage.setItem(STORAGE_KEY, q)
      }
    },
    true,
  )

  // 键盘回车选中搜索结果时，记录当前搜索词
  document.addEventListener(
    'keydown',
    (e) => {
      if (e.key === 'Enter') {
        const input = e.target as HTMLInputElement
        if (input && input.closest('.VPLocalSearchBox')) {
          const q = input.value.trim()
          if (q) sessionStorage.setItem(STORAGE_KEY, q)
        }
      }
    },
    true,
  )

  const router = useRouter()
  router.onAfterRouteChanged(() => {
    const q = sessionStorage.getItem(STORAGE_KEY)
    if (q) {
      sessionStorage.removeItem(STORAGE_KEY)
      waitForContent(() => highlightTerm(q))
    } else {
      clearMarks()
    }
  })
}
