// Use Vite's import.meta.glob to load all markdown files from the content/posts directory
const postFiles = import.meta.glob('/content/posts/*.md', { as: 'raw', eager: true })

function parseMarkdownFrontmatter(content) {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---/
  const match = content.match(frontmatterRegex)
  
  if (!match) return { frontmatter: {}, content }

  const frontmatterStr = match[1]
  const remainingContent = content.replace(frontmatterRegex, '').trim()
  
  const frontmatter = {}
  frontmatterStr.split('\n').forEach(line => {
    const [key, ...valueArr] = line.split(':')
    if (key && valueArr.length) {
      let value = valueArr.join(':').trim()
      // Remove quotes if they exist
      value = value.replace(/^"(.*)"$/, '$1')
      
      // Parse arrays (e.g., tags: [item1, item2])
      if (value.startsWith('[') && value.endsWith(']')) {
        value = value
          .slice(1, -1)
          .split(',')
          .map(item => item.trim().replace(/^"(.*)"$/, '$1'))
      }
      
      frontmatter[key.trim()] = value
    }
  })

  return {
    frontmatter,
    content: remainingContent
  }
}

export function getPostBySlug(slug) {
  const postPath = `/content/posts/${slug}.md`
  const content = postFiles[postPath]
  
  if (!content) return null

  const { frontmatter, content: markdownContent } = parseMarkdownFrontmatter(content)
  
  return {
    slug,
    frontmatter,
    content: markdownContent
  }
}

export function getAllPosts() {
  return Object.entries(postFiles).map(([path, content]) => {
    // Extract slug from file path (e.g., /content/posts/my-post.md -> my-post)
    const slug = path.replace('/content/posts/', '').replace('.md', '')
    const { frontmatter, content: markdownContent } = parseMarkdownFrontmatter(content)
    
    return {
      slug,
      frontmatter,
      content: markdownContent
    }
  }).sort((post1, post2) => (
    new Date(post2.frontmatter.date) - new Date(post1.frontmatter.date)
  ))
}