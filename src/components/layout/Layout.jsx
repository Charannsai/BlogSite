import { motion, AnimatePresence } from 'framer-motion'
import Header from './Header'

function Layout({ children, isDark, toggleTheme }) {
  return (
    <div className={`${isDark ? 'dark' : ''}`}>
      <Header isDark={isDark} toggleTheme={toggleTheme} />
      <main className="min-h-screen bg-white dark:bg-[#1a1a1a] text-primary dark:text-gray-100">
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}

export default Layout