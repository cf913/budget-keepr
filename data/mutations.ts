import {supabase} from '@/lib/supabase'
import {getSupabaseUser} from './queries'
import {logRes} from '@/utils/helpers'

export const createEntry = async (entry: any) => {
  const user = await getSupabaseUser()
  if (!user) return

  let {data, error}: any = await supabase
    .from('entries')
    .insert({...entry, user_id: user.id})
    .select()

  /// DEV
  logRes('createEntry', data, error)

  return {data, error}
}
