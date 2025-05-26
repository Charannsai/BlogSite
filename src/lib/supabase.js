import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function signInWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`
    }
  })
  if (error) throw error
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function likePost(postSlug) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Must be logged in to like posts')

  const { data, error } = await supabase
    .from('likes')
    .insert({ post_slug: postSlug, user_id: user.id })
    .select()
    .single()

  if (error) {
    if (error.code === '23505') { // Unique violation
      // Unlike if already liked
      await supabase
        .from('likes')
        .delete()
        .match({ post_slug: postSlug, user_id: user.id })
    } else {
      throw error
    }
  }
  return data
}

export async function addComment(postSlug, content) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Must be logged in to comment')

  const { data, error } = await supabase
    .from('comments')
    .insert({ post_slug: postSlug, user_id: user.id, content })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getPostStats(postSlug) {
  const { data: likes, error: likesError } = await supabase
    .from('likes')
    .select('id')
    .eq('post_slug', postSlug)

  const { data: comments, error: commentsError } = await supabase
    .from('comments')
    .select(`
      id,
      content,
      created_at,
      profiles:user_id (
        email:auth.users!id(email),
        user_metadata:auth.users!id(raw_user_meta_data)
      )
    `)
    .eq('post_slug', postSlug)
    .order('created_at', { ascending: false })

  if (likesError || commentsError) throw likesError || commentsError

  return {
    likesCount: likes?.length || 0,
    comments: comments || []
  }
}