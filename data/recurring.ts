import { supabase } from '@/lib/supabase'
import { logRes } from '@/utils/helpers'
import { getSupabaseUser } from './api'
import { Frequency } from '@/components/RecurringInputs'

export type RecurringInput = {
  id?: string
  budget_id: string
  start_at: string
  next_at: string
  sub_category_id: string
  amount: number
  frequency: Frequency
  active: boolean
}

export const createRecurring = async (recurring: RecurringInput) => {
  // sleep for 2 seconds
  // await new Promise(resolve => setTimeout(resolve, 2000))
  // return { data: { success: true }, error: null }

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
