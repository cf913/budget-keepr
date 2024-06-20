import {supabase} from '@/lib/supabase'
import {getSupabaseUser} from './api'

export const getCategories = async (budget_id?: string) => {
  const user = await getSupabaseUser()
  if (!user) return

  if (!budget_id) throw new Error('No budget_id provided')

  const {data, error} = await supabase
    .from('categories')
    .select(
      `
        id,
        name,
        color,
        sub_categories(
          id
        )
      `,
    )
    .eq('budget_id', budget_id)
    .order('name', {ascending: true})

  if (error) throw error

  return data
}

export interface CategoryInput {
  id?: string
  name: string
  budget_id: string
}

export const createCategory = async (category: CategoryInput) => {
  const user = await getSupabaseUser()
  if (!user) return

  const {data, error} = await supabase.from('categories').insert(category)

  if (error) throw error

  return data
}
