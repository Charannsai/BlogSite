import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getAllPosts } from '../utils/markdown'
import { motion } from 'framer-motion'
import Skeleton from '../components/Skeleton'

function Home() {
  const [activeTab, setActiveTab] = useState('latest')
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const tags = ['react', 'javascript', 'supabase']

  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true)
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      setPosts(getAllPosts())
      setLoading(false)
    }
    loadPosts()
  }, [])

  const filteredPosts = activeTab === 'latest' 
    ? posts 
    : posts.filter(post => post.frontmatter.tags?.includes(activeTab))

  const FeaturedPostSkeleton = () => (
    <div className="grid md:grid-cols-2 gap-8 items-center">
      <Skeleton className="aspect-video rounded-xl" />
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Skeleton className="w-16 h-5" />
          <Skeleton className="w-2 h-2 rounded-full" />
          <Skeleton className="w-24 h-5" />
        </div>
        <Skeleton className="h-9 w-3/4" />
        <Skeleton className="h-20" />
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      </div>
    </div>
  )

  const PostCardSkeleton = () => (
    <div>
      <Skeleton className="aspect-video rounded-xl mb-4" />
      <div className="flex items-center gap-2 mb-3">
        <Skeleton className="w-16 h-5" />
        <Skeleton className="w-2 h-2 rounded-full" />
        <Skeleton className="w-24 h-5" />
      </div>
      <Skeleton className="h-7 w-3/4 mb-2" />
      <Skeleton className="h-12" />
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Featured Post */}
      <div className="mb-16">
        {loading ? (
          <FeaturedPostSkeleton />
        ) : posts[0] && (
          <Link to={`/blog/${posts[0].slug}`} className="group">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden">
                <img 
                  src={posts[0].frontmatter.image} 
                  alt={posts[0].frontmatter.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm text-accent">Blog</span>
                  <span className="text-sm text-secondary">•</span>
                  <time className="text-sm text-secondary">{posts[0].frontmatter.date}</time>
                </div>
                <h1 className="text-3xl font-bold mb-4 group-hover:text-accent transition-colors">
                  {posts[0].frontmatter.title}
                </h1>
                <p className="text-secondary mb-4 line-clamp-3">
                  {posts[0].frontmatter.excerpt}
                </p>
                <div className="flex items-center gap-3">
                  <img 
                    src="https://github.com/charanpathuri.png" 
                    alt={posts[0].frontmatter.author}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <div className="font-medium">{posts[0].frontmatter.author}</div>
                    <div className="text-sm text-secondary">Developer</div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        )}
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-border mb-8">
        <div className="flex gap-8 -mb-px">
          <button
            onClick={() => setActiveTab('latest')}
            className={`pb-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'latest'
                ? 'border-accent text-accent'
                : 'border-transparent text-secondary hover:text-primary dark:hover:text-white'
            }`}
          >
            Latest Updates
          </button>
          {tags.map(tag => (
            <button
              key={tag}
              onClick={() => setActiveTab(tag)}
              className={`pb-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tag
                  ? 'border-accent text-accent'
                  : 'border-transparent text-secondary hover:text-primary dark:hover:text-white'
              }`}
            >
              {tag.charAt(0).toUpperCase() + tag.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Posts Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          Array(6).fill(null).map((_, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <PostCardSkeleton />
            </motion.div>
          ))
        ) : (
          filteredPosts.map((post, index) => (
            <motion.article
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="group"
            >
              <Link to={`/blog/${post.slug}`}>
                <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden mb-4">
                  <img 
                    src={post.frontmatter.image}
                    alt={post.frontmatter.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm text-accent">
                    {post.frontmatter.tags?.[0]}
                  </span>
                  <span className="text-sm text-secondary">•</span>
                  <time className="text-sm text-secondary">
                    {post.frontmatter.date}
                  </time>
                </div>
                <h2 className="text-xl font-bold mb-2 group-hover:text-accent transition-colors line-clamp-2">
                  {post.frontmatter.title}
                </h2>
                <p className="text-secondary line-clamp-2">
                  {post.frontmatter.excerpt}
                </p>
              </Link>
            </motion.article>
          ))
        )}
      </div>
    </div>
  )
}

export default Home