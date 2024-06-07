import {supabase} from '@/lib/supabase'
import {getSupabaseUser} from './api'

export const deleteEntry = async (entryId: string) => {
  const user = await getSupabaseUser()
  if (!user) return

  const {error} = await supabase.from('entries').delete().eq('id', entryId)

  if (error) throw new Error(error.message)

  return true
}
