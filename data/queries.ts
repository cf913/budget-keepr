import { supabase } from '@/lib/supabase'
import { logRes } from '@/utils/helpers'
import { getSupabaseSession } from './api'

////////////////////////////////////////

// TODO: add a return type
export const getUser = async (): Promise<any | null> => {
  const user = await getSupabaseSession()
  if (!user) return null
  const { data, error } = await supabase.from('users').select('*').single()

  logRes('getUser', data, error)
  return data
}
