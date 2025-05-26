import { useState, useEffect } from 'react'
import { FiHeart, FiMessageSquare, FiShare2 } from 'react-icons/fi'
import { supabase, likePost, addComment } from '../lib/supabase'
import { motion, AnimatePresence } from 'framer-motion'

function SocialFeatures({ postSlug }) {
  const [user, setUser] = useState(null)
  const [stats, setStats] = useState({ likesCount: 0, comments: [] })
  const [isCommenting, setIsCommenting] = useState(false)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    // Get initial auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    // Subscribe to realtime changes
    const likesSubscription = supabase
      .channel('likes_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'likes',
        filter: `post_slug=eq.${postSlug}`
      }, () => {
        fetchStats()
      })
      .subscribe()

    const commentsSubscription = supabase
      .channel('comments_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'comments',
        filter: `post_slug=eq.${postSlug}`
      }, () => {
        fetchStats()
      })
      .subscribe()

    fetchStats()

    return () => {
      subscription.unsubscribe()
      likesSubscription.unsubscribe()
      commentsSubscription.unsubscribe()
    }
  }, [postSlug])

  const fetchStats = async () => {
    try {
      const { data: likes } = await supabase
        .from('likes')
        .select('id')
        .eq('post_slug', postSlug)

      const { data: comments } = await supabase
        .from('comments')
        .select(`
          id,
          content,
          created_at,
          user:user_id (
            email,
            user_metadata
          )
        `)
        .eq('post_slug', postSlug)
        .order('created_at', { ascending: false })

      setStats({
        likesCount: likes?.length || 0,
        comments: comments || []
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const handleLike = async () => {
    if (!user) return
    try {
      await likePost(postSlug)
    } catch (error) {
      console.error('Error liking post:', error)
    }
  }

  const handleComment = async (e) => {
    e.preventDefault()
    if (!user || !comment.trim()) return

    setIsSubmitting(true)
    try {
      await addComment(postSlug, comment.trim())
      setComment('')
      setIsCommenting(false)
    } catch (error) {
      console.error('Error adding comment:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleShare = async () => {
    try {
      await navigator.share({
        title: document.title,
        url: window.location.href
      })
    } catch (error) {
      console.error('Error sharing:', error)
    }
  }

  return (
    <div className="mt-8 border-t border-gray-200 dark:border-gray-700/50 pt-8">
      <div className="flex items-center gap-6">
        <button
          onClick={handleLike}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-accent dark:hover:text-accent transition-colors"
          disabled={!user}
        >
          <FiHeart className="w-5 h-5" />
          <span>{stats.likesCount}</span>
        </button>
        <button
          onClick={() => setIsCommenting(!isCommenting)}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-accent dark:hover:text-accent transition-colors"
        >
          <FiMessageSquare className="w-5 h-5" />
          <span>{stats.comments.length}</span>
        </button>
        <button
          onClick={handleShare}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-accent dark:hover:text-accent transition-colors"
        >
          <FiShare2 className="w-5 h-5" />
          <span>Share</span>
        </button>
      </div>

      <AnimatePresence>
        {isCommenting && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6"
          >
            {user ? (
              <form onSubmit={handleComment} className="space-y-4">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-accent/50"
                  rows="3"
                />
                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setIsCommenting(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !comment.trim()}
                    className="px-4 py-2 text-sm font-medium bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? 'Posting...' : 'Post Comment'}
                  </button>
                </div>
              </form>
            ) : (
              <p className="text-center text-gray-600 dark:text-gray-400">
                Please sign in to comment
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {stats.comments.length > 0 && (
        <div className="mt-8 space-y-6">
          <h3 className="text-lg font-semibold">Comments</h3>
          {stats.comments.map((comment) => (
            <div key={comment.id} className="border-b border-gray-200 dark:border-gray-700/50 last:border-0 pb-6">
              <div className="flex items-center gap-3 mb-2">
                <img
                  src={comment.user.user_metadata.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.user.user_metadata.full_name || comment.user.email)}`}
                  alt={comment.user.user_metadata.full_name || comment.user.email}
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <div className="font-medium">{comment.user.user_metadata.full_name || comment.user.email}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(comment.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300">{comment.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SocialFeatures