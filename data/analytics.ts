import {supabase} from '@/lib/supabase'
import {getSupabaseUser} from './api'

export const getAllTimeSpend = async () => {
  const user = await getSupabaseUser()
  if (!user) return

  const {data, error} = await supabase
    .from('entries')
    .select('amount.sum()')
    .eq('user_id', user.id)
    .single()

  if (error) throw new Error(error.message)

  return data.sum
}

export const getAvgDailySpend = async () => {
  const user = await getSupabaseUser()
  if (!user) return

  const {data, error} = await supabase
    .from('entries')
    .select('created_at')
    .eq('user_id', user.id)
    .order('created_at', {ascending: true})
    .limit(1)
    .single()

  console.log('DATA', data)

  if (error) throw new Error(error.message)

  return data
}

export const getCurrentWeekSpend = () => {}
