import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { getAllPosts } from '../utils/markdown'
import { FiSearch, FiChevronDown } from 'react-icons/fi'

function Blogs() {
  const [selectedTag, setSelectedTag] = useState(null)
  const [expandedTags, setExpandedTags] = useState({})
  const [searchQuery, setSearchQuery] = useState('')
  const allPosts = getAllPosts()

  const postsByTag = allPosts.reduce((acc, post) => {
    post.frontmatter.tags?.forEach(tag => {
      if (!acc[tag]) acc[tag] = []
      acc[tag].push(post)
    })
    return acc
  }, {})

  const toggleTag = (tag) => {
    setExpandedTags(prev => ({
      ...prev,
      [tag]: !prev[tag]
    }))
  }

  const filteredPosts = allPosts.filter(post => {
    const matchesSearch = searchQuery === '' || 
      post.frontmatter.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.frontmatter.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  // Function to trigger the global search dialog
  const handleSearchClick = (e) => {
    e.preventDefault()
    // Simulate pressing Ctrl+K to open the global search dialog
    const event = new KeyboardEvent('keydown', {
      key: 'k',
      ctrlKey: true,
      metaKey: true,
      bubbles: true
    })
    document.dispatchEvent(event)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      <div className="py-8">
        <div className="max-w-xl mx-auto mb-8">
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search posts..."
              className="w-full pl-11 pr-4 py-3 rounded-lg bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClick={handleSearchClick}
              readOnly
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
          <motion.aside 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:sticky lg:top-24 space-y-4 h-fit"
          >
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Topics</h3>
            {Object.entries(postsByTag).map(([tag, posts]) => (
              <div 
                key={tag} 
                className="border-b border-gray-200 dark:border-gray-700/50 last:border-0"
              >
                <button
                  onClick={() => toggleTag(tag)}
                  className="flex items-center justify-between w-full py-3 text-left text-gray-900 dark:text-gray-300 hover:text-accent dark:hover:text-accent transition-colors"
                >
                  <span className="font-medium">{tag}</span>
                  <motion.div
                    animate={{ rotate: expandedTags[tag] ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FiChevronDown />
                  </motion.div>
                </button>
                <AnimatePresence initial={false}>
                  {expandedTags[tag] && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="pl-4 pb-3 space-y-2">
                        {posts.map(post => (
                          <Link
                            key={post.slug}
                            to={`/blog/${post.slug}`}
                            className="block text-sm text-gray-600 dark:text-gray-400 hover:text-accent dark:hover:text-accent transition-colors py-1"
                          >
                            {post.frontmatter.title}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </motion.aside>

          <motion.main
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-1 gap-6">
              {filteredPosts.map(post => (
                <motion.article
                  key={post.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="group border border-gray-200 dark:border-gray-700/50 rounded-xl p-6 bg-white dark:bg-gray-800/50 hover:shadow-lg transition-all duration-300"
                >
                  <h2 className="text-xl font-medium mb-2 text-gray-900 dark:text-white group-hover:text-accent transition-colors">
                    <Link to={`/blog/${post.slug}`}>
                      {post.frontmatter.title}
                    </Link>
                  </h2>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                    {post.frontmatter.date} • {post.frontmatter.author}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{post.frontmatter.excerpt}</p>
                  <div className="flex flex-wrap gap-2">
                    {post.frontmatter.tags?.map(tag => (
                      <span key={tag} className="text-xs bg-accent/10 text-accent px-2 py-1 rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </motion.article>
              ))}
            </div>
          </motion.main>
        </div>
      </div>
    </div>
  )
}

export default Blogs