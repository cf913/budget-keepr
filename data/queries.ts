import { supabase } from '@/lib/supabase'
import { logRes } from '@/utils/helpers'
import { getSupabaseUser } from './api'
import { Entry } from '@/components/RecentEntries'

////////////////////////////////////////

// TODO: add a return type
export const getUser = async (): Promise<any | null> => {
  const user = await getSupabaseUser()
  if (!user) return null
  const { data, error } = await supabase.from('users').select('*').single()
  logRes('getUser', data, error)
  return data
}

export const getBudgets = async () => {
  const user = await getSupabaseUser()
  if (!user) return

  const { data, error } = await supabase.from('budgets').select('*')

  /// DEV
  logRes('getBudgets', data, error)

  return data
}

export const getEntries = async (budgetId?: string) => {
  const user = await getSupabaseUser()
  if (!user) return

  if (!budgetId) return

  const { data, error } = await supabase
    .from('entries')
    .select(
      `
      id,
      category:category_id(id, name, color),
      sub_category:sub_category_id(id, name),
      amount,
      created_at
      `,
    )
    .eq('budget_id', budgetId)
    .order('created_at', { ascending: false })
    .limit(3)
    .returns<Entry[]>()

  /// DEV
  // logRes('getEntries', data, error)

  if (error) throw new Error(error.message)

  return data
}
