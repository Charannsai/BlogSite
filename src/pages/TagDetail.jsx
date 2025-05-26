import { useParams, Link } from 'react-router-dom'
import { getAllPosts } from '../utils/markdown'

function TagDetail() {
  const { tagName } = useParams()
  const posts = getAllPosts()
  const tagPosts = posts.filter(post => post.frontmatter.tags?.includes(tagName))

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <Link 
        to="/tags" 
        className="inline-flex items-center text-secondary hover:text-primary dark:hover:text-white mb-8"
      >
        ← Back to Topics
      </Link>
      <h1 className="text-3xl font-bold mb-8">#{tagName}</h1>
      <div className="space-y-6">
        {tagPosts.map(post => (
          <article key={post.slug} className="border border-border rounded-lg p-6 hover:shadow-lg transition-all duration-300">
            <h2 className="text-xl font-medium mb-2">
              <Link to={`/blog/${post.slug}`} className="hover:text-accent transition-colors">
                {post.frontmatter.title}
              </Link>
            </h2>
            <div className="text-sm text-secondary mb-3">
              {post.frontmatter.date} • {post.frontmatter.author}
            </div>
            <p className="text-secondary mb-4">{post.frontmatter.excerpt}</p>
          </article>
        ))}
      </div>
    </div>
  )
}

export default TagDetail