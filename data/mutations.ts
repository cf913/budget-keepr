import { supabase } from '@/lib/supabase'
import { logRes } from '@/utils/helpers'
import { getSupabaseUser } from './api'

export const createEntry = async (entry: any) => {
  // sleep for 2 seconds
  // await new Promise(resolve => setTimeout(resolve, 2000))
  // return { data: { success: true }, error: null }

  const user = await getSupabaseUser()
  if (!user) return

  let { data, error }: any = await supabase
    .from('entries')
    .insert({ ...entry, user_id: user.id })
    .select()

  /// DEV
  logRes('createEntry', data, error)

  return { data, error }
}

export const updateEntry = async (entry: any) => {
  // sleep for 2 seconds
  // await new Promise(resolve => setTimeout(resolve, 2000))
  // return { data: { success: true }, error: null }

  const user = await getSupabaseUser()
  if (!user) return

  let { data, error }: any = await supabase
    .from('entries')
    .update(entry)
    .eq('id', entry.id)
    .select()

  /// DEV
  logRes('updateEntry', data, error)

  return { data, error }
}
