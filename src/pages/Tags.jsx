import { Link, useNavigate } from 'react-router-dom'
import { getAllPosts } from '../utils/markdown'

function Tags() {
  const navigate = useNavigate()
  const posts = getAllPosts()
  
  const tagCounts = posts.reduce((acc, post) => {
    post.frontmatter.tags?.forEach(tag => {
      acc[tag] = (acc[tag] || 0) + 1
    })
    return acc
  }, {})

  const handleTagClick = (tag) => {
    navigate(`/tags/${tag}`)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-3xl font-bold mb-8">Topics</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(tagCounts).map(([tag, count]) => (
          <button
            key={tag}
            onClick={() => handleTagClick(tag)}
            className="border border-border rounded-lg p-6 hover:shadow-lg transition-all duration-300 text-left bg-white dark:bg-gray-800/50"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">#{tag}</h2>
              <span className="text-sm text-secondary bg-accent/10 px-2 py-1 rounded">
                {count} posts
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default Tags