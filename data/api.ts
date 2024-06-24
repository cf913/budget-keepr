import { supabase } from '@/lib/supabase'
import { Session } from '@supabase/supabase-js'

export const getSupabaseUser = async () => {
  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession()

    if (error) {
      alert('unable to getUser: ' + error.message)
      return
    }

    const user = session?.user

    if (!user) {
      alert('getUser: User not found')
      return
    }
    return user
  } catch (e) {
    throw e
  }
}

export const isAdmin = (session?: Session | null) => {
  const ADMIN_ID = 'ddee3ea7-0d3d-4194-8ab1-5e0a36ec2026'

  if (!session) return false

  return session.user?.id === ADMIN_ID
//  const user = await getSupabaseUser()
//  if (!user) return
// const me = await supabase.auth.g
//  return user.is_admin
}
