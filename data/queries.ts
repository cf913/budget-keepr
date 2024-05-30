import {Profile} from '@/app/(app)/(tabs)/profile'
import {supabase} from '@/lib/supabase'
import {logRes} from '@/utils/helpers'

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

export const getUser = async (): Promise<Profile | null> => {
  const user = await getSupabaseUser()
  if (!user) return null
  const {data, error} = await supabase.from('users').select('*').single()
  logRes('getUser', data, error)
  return data
}

export const getBudgets = async () => {
  const user = await getSupabaseUser()
  if (!user) return

  const {data, error} = await supabase.from('budgets').select('*')

  /// DEV
  logRes('getBudgets', data, error)

  return data
}
