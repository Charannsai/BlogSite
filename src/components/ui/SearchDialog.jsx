import { useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiSearch, FiX, FiTwitter, FiGithub, FiLinkedin, FiInstagram } from 'react-icons/fi'

const socialLinks = [
  { 
    command: '/twitter', 
    handle: '@saircasticc', 
    url: 'https://x.com/saircasticc',
    icon: <FiTwitter className="w-5 h-5" />
  },
  { 
    command: '/github', 
    handle: 'charannsai', 
    url: 'https://github.com/charannsai',
    icon: <FiGithub className="w-5 h-5" />
  },
  { 
    command: '/linkedin', 
    handle: 'charannsai', 
    url: 'https://linkedin.com/in/charannsai',
    icon: <FiLinkedin className="w-5 h-5" />
  },
  { 
    command: '/instagram', 
    handle: 'saircasticc', 
    url: 'https://instagram.com/saircasticc',
    icon: <FiInstagram className="w-5 h-5" />
  }
]

function SearchDialog({ isOpen, onClose, searchQuery, setSearchQuery, filteredPosts }) {
  const handleKeyPress = useCallback((e) => {
    if (isOpen) {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === '/' && !e.target.matches('input')) {
        e.preventDefault()
        setSearchQuery('/')
      }
    }
  }, [isOpen, onClose, setSearchQuery])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [handleKeyPress])

  const filteredSocials = socialLinks.filter(social => 
    searchQuery.startsWith('/') && (
      social.command.toLowerCase().includes(searchQuery.toLowerCase()) ||
      social.handle.toLowerCase().includes(searchQuery.toLowerCase())
    )
  )

  const handleSocialClick = (url) => {
    window.open(url, '_blank')
    onClose()
  }

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", bounce: 0.25, duration: 0.3 }}
            className="fixed left-[35%] -translate-x-[50%] w-full max-w-2xl px-4 top-[30vh] z-50"
          >
            <div className="bg-white dark:bg-gray-800/95 rounded-xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-xl overflow-hidden">
              <div className="p-4">
                <div className="relative">
                  <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search posts or type / for commands..."
                    className="w-full pl-11 pr-10 py-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent/50"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                  />
                  {searchQuery && (
                    <button
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                      onClick={() => setSearchQuery('')}
                    >
                      <FiX />
                    </button>
                  )}
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700/50">
                <div className="max-h-[60vh] overflow-y-auto">
                  {searchQuery.startsWith('/') && filteredSocials.length > 0 && (
                    <div className="p-4">
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Social Links</h3>
                      <div className="space-y-1">
                        {filteredSocials.map((social) => (
                          <motion.button
                            key={social.command}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={() => handleSocialClick(social.url)}
                            className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg text-left transition-colors"
                          >
                            <span className="text-accent">{social.icon}</span>
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">{social.command}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">{social.handle}</div>
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  )}

                  {filteredPosts.length > 0 && (
                    <div className="p-4">
                      {searchQuery.startsWith('/') && filteredSocials.length > 0 && (
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Posts</h3>
                      )}
                      <div className="space-y-1">
                        {filteredPosts.map(post => (
                          <motion.div
                            key={post.slug}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                          >
                            <Link
                              to={`/blog/${post.slug}`}
                              className="block p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
                              onClick={onClose}
                            >
                              <h3 className="font-medium text-gray-900 dark:text-white">{post.frontmatter.title}</h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">{post.frontmatter.excerpt}</p>
                            </Link>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-4 border-t border-gray-200 dark:border-gray-700/50">
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>Press <kbd className="px-2 py-1 text-xs font-semibold bg-gray-100 dark:bg-gray-700 rounded">/</kbd>for my Socials</span>
                    <span>ESC to close</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default SearchDialog