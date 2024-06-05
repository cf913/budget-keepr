import {supabase} from '@/lib/supabase'
import {getSupabaseUser} from './api'
import {getWeekNumber} from '@/utils/helpers'
import dayjs from 'dayjs'

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

export const getCurrentWeekSpend = async () => {
  const user = await getSupabaseUser()
  if (!user) return

  const currentWeek = getWeekNumber()

  const {data, error} = await supabase
    .from('entries')
    .select('amount.sum()')
    .eq('user_id', user.id)
    .eq('week', currentWeek)
    .single()

  if (error) throw new Error(error.message)

  return data.sum
}

export const getTodaySpend = async () => {
  const user = await getSupabaseUser()
  if (!user) return

  const now = dayjs()

  const [start, end] = [
    now.startOf('d').toISOString(),
    now.endOf('d').toISOString(),
  ]

  const {data, error} = await supabase
    .from('entries')
    .select('amount.sum()')
    .eq('user_id', user.id)
    .lte('created_at', end)
    .gte('created_at', start)
    .single()

  if (error) throw new Error(error.message)

  return data.sum
}
