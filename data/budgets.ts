import { supabase } from '@/lib/supabase'
import { getSupabaseSession } from './api'
import { logRes } from '@/utils/helpers'
import { Budget } from '@/stores/localSettings'

export const getBudgets = async () => {
  const user = await getSupabaseSession()
  if (!user) return

  let query = supabase
    .from('budgets')
    .select(
      `
    id,
    name,
    team:team_id (
      id,
      members (
        id,
        user:user_id (
          id,
          username,
          avatar_url
        )
      )
    )
  `,
    )
    .returns<Budget[]>()

  const { data, error } = await query

  logRes('getBudgets', data, error)
  if (error) throw new Error(error.message)

  return data
}
