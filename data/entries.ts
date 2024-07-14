import { supabase } from '@/lib/supabase'
import { getSupabaseUser } from './api'
import { Entry } from '@/components/RecentEntries'

export const deleteEntry = async (entryId: string) => {
  const user = await getSupabaseUser()
  if (!user) return

  const { error } = await supabase.from('entries').delete().eq('id', entryId)

  if (error) throw new Error(error.message)

  return true
}

export const getEntries = async (
  budgetId?: string,
  filters?: { limit?: number; offset?: number },
) => {
  const user = await getSupabaseUser()
  if (!user) return

  let query = supabase.from('entries').select(
    `
      id,
      category:category_id(id, name, color),
      sub_category:sub_category_id(id, name),
      amount,
      created_at
      `,
  )

  if (budgetId) query = query.eq('budget_id', budgetId)

  if (filters?.limit) {
    const from = filters?.offset || 0
    const to = from + filters?.limit
    query = query.range(from, to)
  }
  /// DEV
  // logRes('getEntries', data, error)
  const { data, error } = await query
    .order('created_at', { ascending: false })
    .returns<Entry[]>()

  if (error) throw new Error(error.message)

  return data
}
