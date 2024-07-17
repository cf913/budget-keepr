import { supabase } from '@/lib/supabase'
import { logRes } from '@/utils/helpers'
import { getSupabaseSession } from './api'
import { Entry } from '@/components/RecentEntries'

////////////////////////////////////////

// TODO: add a return type
export const getUser = async (): Promise<any | null> => {
  const user = await getSupabaseSession()
  if (!user) return null
  const { data, error } = await supabase.from('users').select('*').single()

  logRes('getUser', data, error)
  return data
}

export const getBudgets = async () => {
  const user = await getSupabaseSession()
  if (!user) return

  const { data, error } = await supabase.from('budgets').select('*')

  /// DEV
  logRes('getBudgets', data, error)

  return data
}
