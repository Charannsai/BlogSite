import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { FiSun, FiMoon, FiMenu, FiX, FiSearch } from 'react-icons/fi'
import { supabase, signInWithGoogle, signOut } from '../../lib/supabase'
import { useEffect } from 'react'

function Header({ isDark, toggleTheme }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Get initial auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const handleAuth = async () => {
    if (user) {
      await signOut()
    } else {
      await signInWithGoogle()
    }
  }

  return (
    <nav className="border-b border-border/10 sticky top-0 bg-white/80 dark:bg-[#1a1a1a]/90 backdrop-blur-lg z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          <NavLink to="/" className="text-xl font-semibold text-primary dark:text-gray-100">
            Charan Sai Pathuri | Blog
          </NavLink>
          
          <div className="hidden md:flex items-center gap-8">
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                `text-sm font-medium ${isActive ? 'text-primary dark:text-white' : 'text-secondary hover:text-primary dark:text-gray-400 dark:hover:text-white'} transition-colors`
              }
            >
              Home
            </NavLink>
            <NavLink 
              to="/blogs" 
              className={({ isActive }) => 
                `text-sm font-medium ${isActive ? 'text-primary dark:text-white' : 'text-secondary hover:text-primary dark:text-gray-400 dark:hover:text-white'} transition-colors`
              }
            >
              Blogs
            </NavLink>
            <NavLink 
              to="/tags" 
              className={({ isActive }) => 
                `text-sm font-medium ${isActive ? 'text-primary dark:text-white' : 'text-secondary hover:text-primary dark:text-gray-400 dark:hover:text-white'} transition-colors`
              }
            >
              Tags
            </NavLink>
            <NavLink 
              to="/about" 
              className={({ isActive }) => 
                `text-sm font-medium ${isActive ? 'text-primary dark:text-white' : 'text-secondary hover:text-primary dark:text-gray-400 dark:hover:text-white'} transition-colors`
              }
            >
              About
            </NavLink>
            <button
              onClick={handleAuth}
              className="text-sm font-medium px-4 py-2 rounded-lg bg-accent text-white hover:bg-accent/90 transition-colors"
            >
              {user ? 'Sign Out' : 'Sign In'}
            </button>
          </div>

          <div className="flex md:hidden items-center gap-4">
            <button
              onClick={handleAuth}
              className="text-sm font-medium px-4 py-2 rounded-lg bg-accent text-white hover:bg-accent/90 transition-colors"
            >
              {user ? 'Sign Out' : 'Sign In'}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {isMenuOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-4 pt-2 pb-3 space-y-1 bg-white dark:bg-[#1a1a1a] border-t border-border/10">
          <NavLink 
            to="/" 
            onClick={closeMenu}
            className={({ isActive }) => 
              `block px-3 py-2 rounded-md text-base font-medium ${
                isActive 
                  ? 'text-primary dark:text-white bg-gray-50 dark:bg-gray-800' 
                  : 'text-secondary hover:text-primary dark:text-gray-400 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
              } transition-colors`
            }
          >
            Home
          </NavLink>
          <NavLink 
            to="/blogs"
            onClick={closeMenu}
            className={({ isActive }) => 
              `block px-3 py-2 rounded-md text-base font-medium ${
                isActive 
                  ? 'text-primary dark:text-white bg-gray-50 dark:bg-gray-800' 
                  : 'text-secondary hover:text-primary dark:text-gray-400 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
              } transition-colors`
            }
          >
            Blogs
          </NavLink>
          <NavLink 
            to="/tags"
            onClick={closeMenu}
            className={({ isActive }) => 
              `block px-3 py-2 rounded-md text-base font-medium ${
                isActive 
                  ? 'text-primary dark:text-white bg-gray-50 dark:bg-gray-800' 
                  : 'text-secondary hover:text-primary dark:text-gray-400 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
              } transition-colors`
            }
          >
            Tags
          </NavLink>
          <NavLink 
            to="/about"
            onClick={closeMenu}
            className={({ isActive }) => 
              `block px-3 py-2 rounded-md text-base font-medium ${
                isActive 
                  ? 'text-primary dark:text-white bg-gray-50 dark:bg-gray-800' 
                  : 'text-secondary hover:text-primary dark:text-gray-400 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
              } transition-colors`
            }
          >
            About
          </NavLink>
        </div>
      </div>
    </nav>
  )
}

export default Header