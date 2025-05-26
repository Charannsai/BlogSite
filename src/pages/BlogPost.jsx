import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeSlug from 'rehype-slug'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { getPostBySlug } from '../utils/markdown'
import { FiArrowLeft, FiList, FiX } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import SocialFeatures from '../components/SocialFeatures'

function BlogPost() {
  const { slug } = useParams()
  const post = getPostBySlug(slug)
  const [copiedCode, setCopiedCode] = useState('')
  const [activeSection, setActiveSection] = useState('')
  const [showTOC, setShowTOC] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      {
        rootMargin: '-10% 0px -70% 0px'
      }
    )

    const headings = document.querySelectorAll('h2[id], h3[id]')
    headings.forEach((heading) => observer.observe(heading))

    return () => observer.disconnect()
  }, [post?.content])

  if (!post) {
    return <div>Post not found</div>
  }

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(''), 2000)
  }

  const TableOfContents = ({ content }) => {
    const headings = content.match(/^#{2,3} .+$/gm) || []

    const scrollToHeading = (slug) => {
      const element = document.getElementById(slug)
      if (element) {
        const navHeight = 80
        const offset = element.getBoundingClientRect().top + window.scrollY - navHeight - 20
        
        window.scrollTo({
          top: offset,
          behavior: 'smooth'
        })

        element.classList.add('highlight')
        setTimeout(() => {
          element.classList.remove('highlight')
        }, 2000)

        if (window.innerWidth < 768) {
          setShowTOC(false)
        }
      }
    }

    return (
      <div className={`
        md:sticky md:top-24 md:h-[calc(100vh-8rem)]
        fixed inset-y-0 right-0 w-full sm:w-80 bg-white dark:bg-gray-900 md:bg-transparent
        transform transition-transform duration-300 ease-in-out z-50
        ${showTOC ? 'translate-x-0' : 'translate-x-full'}
        md:translate-x-0 md:w-auto md:relative md:inset-auto
        overflow-hidden flex flex-col
      `}>
        <div className="flex items-center justify-between p-4 md:p-0 border-b border-gray-200 dark:border-gray-700 md:border-none">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Table of Contents</h4>
          <button
            onClick={() => setShowTOC(false)}
            className="md:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto p-4 md:p-0 md:pr-4">
          <div className="space-y-1">
            {headings.map((heading, index) => {
              const level = heading.match(/^#{2,3}/)[0].length - 1
              const title = heading.replace(/^#{2,3} /, '')
              const slug = title.toLowerCase().replace(/[^\w]+/g, '-')
              
              return (
                <div
                  key={index}
                  style={{ paddingLeft: `${(level - 1) * 1}rem` }}
                  className={`
                    border-l-2 transition-colors duration-200
                    ${activeSection === slug 
                      ? 'border-accent' 
                      : 'border-transparent'
                    }
                  `}
                >
                  <button
                    onClick={() => scrollToHeading(slug)}
                    className={`
                      block w-full text-left py-2 px-3 rounded-r transition-all duration-200
                      ${activeSection === slug
                        ? 'text-accent font-medium bg-accent/5 dark:bg-accent/10'
                        : 'text-gray-600 hover:text-accent dark:text-gray-400 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800/50'
                      }
                    `}
                  >
                    {title}
                  </button>
                </div>
              )
            })}
          </div>
        </nav>
      </div>
    )
  }

  const contentWithoutTOC = post.content.replace(/Table of Contents[\s\S]*?(?=##)/, '')

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <Link 
          to="/blogs" 
          className="inline-flex items-center gap-2 text-gray-600 hover:text-accent dark:text-gray-400 dark:hover:text-white transition-colors font-medium"
        >
          <FiArrowLeft className="h-5 w-5" /> Back to Blogs
        </Link>
        <button
          onClick={() => setShowTOC(!showTOC)}
          className="md:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <FiList className="h-6 w-6" />
        </button>
      </div>
      
      <div className="grid md:grid-cols-[1fr_280px] gap-8">
        <article className="prose prose-lg max-w-none dark:prose-invert prose-headings:scroll-mt-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              {post.frontmatter.title}
            </h1>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-8">
              <time>{post.frontmatter.date}</time>
              <span>•</span>
              <span>{post.frontmatter.author}</span>
            </div>
          </motion.div>
          
          <div className="prose-pre:overflow-x-auto prose-pre:bg-[#1a1a1a] dark:prose-pre:bg-gray-900 prose-pre:rounded-lg">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw, rehypeSlug]}
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '')
                  const code = String(children).replace(/\n$/, '')

                  if (!inline && match) {
                    return (
                      <div className="relative group my-8">
                        <button
                          className="opacity-0 group-hover:opacity-100 absolute top-2 right-2 bg-white/10 border border-white/20 text-gray-300 px-2 py-1 rounded text-sm cursor-pointer hover:bg-white/20 transition-all duration-200"
                          onClick={() => handleCopyCode(code)}
                        >
                          {copiedCode === code ? 'Copied!' : 'Copy'}
                        </button>
                        <SyntaxHighlighter
                          language={match[1]}
                          style={tomorrow}
                          className="!rounded-lg !bg-[#1a1a1a] dark:!bg-gray-900 !p-4 !my-0"
                          {...props}
                        >
                          {code}
                        </SyntaxHighlighter>
                      </div>
                    )
                  }

                  return (
                    <code className="bg-gray-100 dark:bg-gray-800 rounded px-1.5 py-0.5 font-mono text-sm" {...props}>
                      {children}
                    </code>
                  )
                }
              }}
            >
              {contentWithoutTOC}
            </ReactMarkdown>
          </div>

          <SocialFeatures postSlug={slug} />
        </article>

        <aside className="hidden md:block">
          <TableOfContents content={post.content} />
        </aside>
      </div>

      <AnimatePresence>
        {showTOC && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setShowTOC(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default BlogPost