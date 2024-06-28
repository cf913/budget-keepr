import { supabase } from '@/lib/supabase'
import { logRes } from '@/utils/helpers'
import { getSupabaseUser } from './api'
import { Frequency } from '@/components/RecurringInputs'
import { Category, SubCategory } from '@/components/RecentEntries'

export type RecurringUpdateInput = {
  id: string
  active?: boolean
  archived?: boolean
}

export type RecurringInput = {
  id?: string
  budget_id: string
  start_at: string
  next_at: string
  sub_category_id: string
  category_id?: string
  amount: number
  frequency: Frequency
  active: boolean
}

export type Recurring = {
  id: string
  budget_id?: string
  start_at: string
  created_at: string
  next_at: string
  sub_category: SubCategory
  category: Category
  amount: number
  frequency: Frequency
  active: boolean
  archived: boolean
}

export const createRecurring = async (recurring: RecurringInput) => {

  const user = await getSupabaseUser()
  if (!user) return

  let { data, error }: any = await supabase
    .from('recurring')
    .insert(recurring)
    .select()

  /// DEV
  logRes('createRecurring', data, error)

  return { data, error }
}

export const getRecurrings = async (budget_id?: string): Promise<Recurring[]> => {
  const user = await getSupabaseUser()
  if (!user) throw new Error('No user found')

  if (!budget_id) throw new Error('No budget_id provided')

  console.log('FETCHING RECURRINGS')

  const { data, error } = await supabase
    .from('recurring')
    .select(
      `
        id,
        next_at,
        created_at,
        active,
        amount,
        frequency,
        sub_category:sub_category_id(
          id,
          name
        ),
        category:category_id(
          id,
          name
        ),
        archived
      `,
    )
    .eq('budget_id', budget_id)
    .order('next_at', { ascending: true })
    .returns<Recurring[]>()

  if (error) throw error

  return data
}

export const updateRecurring = async (recurring: RecurringUpdateInput) => {
  const user = await getSupabaseUser()
  if (!user) throw new Error('No user found')

  if (!recurring.id) throw new Error('No recurring id provided')

  let { data, error } = await supabase
    .from('recurring')
    .update(recurring)
    .eq('id', recurring.id)
    .select()
    .returns<Recurring>()

  if (error) throw error

  return data

}

export const deleteRecurring = async (id: string) => {
  const user = await getSupabaseUser()
  if (!user) throw new Error('No user found')

  if (!id) throw new Error('No recurring id provided')

  let { error } = await supabase
    .from('recurring')
    .delete()
    .eq('id', id)

  if (error) throw error

  return
}


