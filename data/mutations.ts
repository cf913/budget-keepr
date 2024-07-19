import { supabase } from '@/lib/supabase'
import { logRes } from '@/utils/helpers'
import { getSupabaseSession } from './api'

export const createEntry = async (entry: any) => {
  const user = await getSupabaseSession()
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
  const user = await getSupabaseSession()
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
