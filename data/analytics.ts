import { supabase } from '@/lib/supabase'
import { getSupabaseUser } from './api'
import { getSQLFriendlyMonth, getWeekNumber } from '@/utils/helpers'
import dayjs from 'dayjs'

export const getAllTimeSpend = async (budget_id?: string) => {
  const user = await getSupabaseUser()
  if (!user) return
  let query = supabase.from('entries').select('amount.sum()')
  if (budget_id) query = query.eq('budget_id', budget_id)
  const { data, error } = await query
    // .eq('user_id', user.id)
    .single()
  if (error) throw new Error(error.message)
  return data.sum
}

export const getThisYearSpend = async (budget_id?: string) => {
  const user = await getSupabaseUser()
  if (!user) return

  const yearNumber = new Date().getFullYear()

  let query = supabase.from('entries').select('amount.sum()')

  if (budget_id) query = query.eq('budget_id', budget_id)

  const { data, error } = await query.eq('year', yearNumber).single()

  if (error) throw new Error(error.message)

  return data.sum
}

export const getCurrentMonthSpend = async (budget_id?: string) => {
  const user = await getSupabaseUser()
  if (!user) return

  const monthNumber = getSQLFriendlyMonth()

  let query = supabase.from('entries').select('amount.sum()')

  if (budget_id) query = query.eq('budget_id', budget_id)

  const { data, error } = await query.eq('month', monthNumber).single()

  if (error) throw new Error(error.message)

  return data.sum
}

export const getAvgDailySpend = async (budget_id?: string) => {
  const user = await getSupabaseUser()
  if (!user) return

  let query = supabase.from('entries').select('created_at')
  // .eq('user_id', user.id)

  if (budget_id) query = query.eq('budget_id', budget_id)

  const { data, error } = await query
    .order('created_at', { ascending: true })
    .limit(1)
    .single()

  if (error) throw new Error(error.message)

  return data
}

export const getLastWeekSpend = async (budget_id?: string) => {
  const user = await getSupabaseUser()
  if (!user) return

  const currentWeek = getWeekNumber() - 1

  let query = supabase.from('entries').select('amount.sum()')

  if (budget_id) query = query.eq('budget_id', budget_id)

  const { data, error } = await query.eq('week', currentWeek).single()

  if (error) throw new Error(error.message)

  return data.sum
}

export const getCurrentWeekSpend = async (budget_id?: string) => {
  const user = await getSupabaseUser()
  if (!user) return

  const currentWeek = getWeekNumber()

  let query = supabase.from('entries').select('amount.sum()')

  if (budget_id) query = query.eq('budget_id', budget_id)

  const { data, error } = await query.eq('week', currentWeek).single()

  if (error) throw new Error(error.message)

  return data.sum
}

export const getTodaySpend = async (budget_id?: string) => {
  const user = await getSupabaseUser()
  if (!user) return

  const now = dayjs()

  const [start, end] = [
    now.startOf('d').toISOString(),
    now.endOf('d').toISOString(),
  ]

  let query = supabase.from('entries').select('amount.sum()')
  // .eq('user_id', user.id)

  if (budget_id) query = query.eq('budget_id', budget_id)

  const { data, error } = await query
    .lte('created_at', end)
    .gte('created_at', start)
    .single()

  if (error) throw new Error(error.message)

  return data.sum
}

export const getBreakdown = async (budget_id: string | null, timeframe: string) => {
  const user = await getSupabaseUser()
  if (!user) throw new Error('User not found')

  let tf = timeframe
  let tf_value = 0

  switch (tf) {
    case 'week':
      tf_value = getWeekNumber()
      break
    case 'month':
      tf_value = getSQLFriendlyMonth()
      break
    case 'year':
      tf_value = new Date().getFullYear()
      break
    default:
      throw new Error('Invalid timeframe')
  }

  let query = supabase
    .from('entries')
    .select('amount.sum(), category:category_id(name, color))')

  if (budget_id) query = query.eq('budget_id', budget_id)

  const { data, error } = await query.eq(tf, tf_value)
  // .order('sum', {ascending: false})
  // .single()

  if (error) throw new Error(error.message)

  return data
}
