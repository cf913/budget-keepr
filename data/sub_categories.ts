import { supabase } from '@/lib/supabase'
import { getSupabaseSession } from './api'
import { logRes } from '@/utils/helpers'
import { SubCategory } from '@/components/RecentEntries'

export const getSubCategories = async ({
  categoryId,
  budget_id,
}: {
  categoryId?: string
  budget_id?: string
}): Promise<SubCategory[]> => {
  const user = await getSupabaseSession()
  if (!user) throw new Error('Current user not found')

  console.log('budget_id', budget_id)

  let query = supabase.from('sub_categories').select(
    `
      id,
      name,
      category:parent_id(id, name, color)
      `,
  )

  if (categoryId) query = query.eq('parent_id', categoryId)
  if (budget_id) query = query.eq('budget_id', budget_id)

  const { data, error } = await query
    .order('name', { ascending: true })
    .returns<SubCategory[]>()

  if (error) throw error

  return data
}

export interface SubCategoryInput {
  id?: string
  name: string
  parent_id: string
  budget_id: string
}

export const createSubCategory = async (sub_category: SubCategoryInput) => {
  const user = await getSupabaseSession()
  if (!user) return

  // await new Promise(res => setTimeout(res, 2000))
  // throw new Error('Throwing on purpose')

  const { data, error } = await supabase
    .from('sub_categories')
    .insert({ user_id: user.id, ...sub_category })

  // await new Promise(res => setTimeout(res, 1000))

  if (error) throw error

  return data
}

export const searchSubCategories = async (searchText?: string) => {
  const user = await getSupabaseSession()
  if (!user) return

  let query = supabase
    .from('sub_categories')
    .select(
      `
      id,
      name,
      category:parent_id(id, name)
      `,
    )
    .eq('user_id', user.id)

  if (searchText) query = query.ilike('name', `%${searchText}%`)

  const { data, error } = await query.order('name', { ascending: true })

  /// DEV
  logRes('searchSubCategories', data, error)

  return data
}
