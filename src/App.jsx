import { useState, useCallback, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import Blogs from './pages/Blogs'
import BlogPost from './pages/BlogPost'
import About from './pages/About'
import Tags from './pages/Tags'
import TagDetail from './pages/TagDetail'
import SearchDialog from './components/ui/SearchDialog'
import { getAllPosts } from './utils/markdown'

// Scroll to top component
function ScrollToTop() {
  const location = useLocation()
  
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location])
  
  return null
}

function App() {
  const [isDark, setIsDark] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [posts, setPosts] = useState([])

  useEffect(() => {
    setPosts(getAllPosts())
  }, [])

  const toggleTheme = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle('dark')
  }

  const handleKeyPress = useCallback((e) => {
    // Only handle keyboard shortcuts when search dialog is closed
    if (!isSearchOpen && (e.key === '/' || ((e.metaKey || e.ctrlKey) && e.key === 'k'))) {
      e.preventDefault()
      setIsSearchOpen(true)
    }
  }, [isSearchOpen])
  
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [handleKeyPress])

  const filteredPosts = posts.filter(post => {
    const matchesSearch = searchQuery === '' || 
      post.frontmatter.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.frontmatter.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  return (
    <Router>
      <ScrollToTop />
      <Layout isDark={isDark} toggleTheme={toggleTheme}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/tags" element={<Tags />} />
          <Route path="/tags/:tagName" element={<TagDetail />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Layout>

      <SearchDialog
        isOpen={isSearchOpen}
        onClose={() => {
          setIsSearchOpen(false)
          setSearchQuery('')
        }}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filteredPosts={filteredPosts}
      />
    </Router>
  )
}

export default App