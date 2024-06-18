import {supabase} from '@/lib/supabase'
import {getSupabaseUser} from './api'

export const getBudgets = async () => {
  const user = await getSupabaseUser()
  if (!user) return

  let query = supabase.from('budgets').select()

  const {data, error} = await query

  if (error) throw new Error(error.message)

  return data
}
