import {supabase} from '@/lib/supabase'

export const getSupabaseUser = async () => {
  try {
    const {
      data: {user},
      error,
    } = await supabase.auth.getUser()
    if (error) {
      alert('unable to getUser: ' + error.message)
      return
    }
    if (!user) {
      alert('getUser: User not found')
      return
    }
    return user
  } catch (e) {
    throw e
  }
}
