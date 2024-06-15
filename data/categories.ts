import {supabase} from '@/lib/supabase'
import {getSupabaseUser} from './api'

export const getCategories = async () => {
  const user = await getSupabaseUser()
  if (!user) return

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
    .order('name', {ascending: true})

  if (error) throw error

  return data
}

export interface CategoryInput {
  id?: string
  name: string
}

export const createCategory = async (category: CategoryInput) => {
  const user = await getSupabaseUser()
  if (!user) return

  const {data, error} = await supabase.from('categories').insert(category)

  if (error) throw error

  return data
}
