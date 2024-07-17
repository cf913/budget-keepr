import { supabase } from '@/lib/supabase'
import { getSupabaseSession } from './api'
import { Category } from '@/components/RecentEntries'

export const getCategory = async (id?: string) => {
  const user = await getSupabaseSession()
  if (!user) throw new Error('No user found')

  if (!id) throw new Error('No id provided')

  const { data, error } = await supabase
    .from('categories')
    .select(
      `
        id,
        name,
        color
      `,
    )
    .eq('id', id)
    .single()

  if (error) throw error

  return data
}

export const getCategories = async (budget_id?: string) => {
  const user = await getSupabaseSession()
  if (!user) return

  if (!budget_id) throw new Error('No budget_id provided')

  const { data, error } = await supabase
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
    .order('name', { ascending: true })

  if (error) throw error

  return data
}

export interface CategoryInput {
  id?: string
  name: string
  budget_id: string
  color: string
}

export interface CategoryUpdateInput {
  id: string
  name?: string
  color?: string
}

export const createCategory = async (category: CategoryInput) => {
  const user = await getSupabaseSession()
  if (!user) return

  const { data, error } = await supabase.from('categories').insert(category)

  if (error) throw error

  return data
}

export const updateCategory = async (category: CategoryUpdateInput) => {
  const user = await getSupabaseSession()
  if (!user) throw new Error('No user found')

  if (!category.id) throw new Error('No recurring id provided')

  let { data, error } = await supabase
    .from('categories')
    .update(category)
    .eq('id', category.id)
    .select()
    .returns<Category>()

  if (error) throw error

  return data
}
