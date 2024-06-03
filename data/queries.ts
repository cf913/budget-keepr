import {supabase} from '@/lib/supabase'
import {logRes} from '@/utils/helpers'

export const getSupabaseUser = async () => {
  try {
    const {
      data: {user},
      error,
    } = await supabase.auth.getUser()
    if (error) {
      alert('unable to getUser: ' + error.message)
      return
    }
    if (!user) {
      alert('getUser: User not found')
      return
    }
    return user
  } catch (e) {
    throw e
  }
}

export const getUser = async (): Promise<Profile | null> => {
  const user = await getSupabaseUser()
  if (!user) return null
  const {data, error} = await supabase.from('users').select('*').single()
  logRes('getUser', data, error)
  return data
}

export const getBudgets = async () => {
  const user = await getSupabaseUser()
  if (!user) return

  const {data, error} = await supabase.from('budgets').select('*')

  /// DEV
  logRes('getBudgets', data, error)

  return data
}

export const getEntries = async (budgetId: string) => {
  const user = await getSupabaseUser()
  if (!user) return

  const {data, error} = await supabase
    .from('entries')
    .select(
      `
      id,
      categories(id, name),
      sub_categories(id, name),
      amount,
      created_at
      `,
    )
    .eq('budget_id', budgetId)
    .order('created_at', {ascending: false})
    .limit(5)

  /// DEV
  logRes('getEntries', data, error)

  return data
}

export const searchCategories = async (
  budgetId: string,
  searchText?: string,
) => {
  const user = await getSupabaseUser()
  if (!user) return

  let {data, error} = await supabase.rpc('fuzzy_search', {
    search_text: searchText,
  })

  /// DEV
  logRes('searchCategories', data, error)

  return data
}

export const getCategories = async (budgetId: string, searchText?: string) => {
  const user = await getSupabaseUser()
  if (!user) return

  let query = supabase
    .from('sub_categories')
    .select(
      `
      id,
      name,
      categories:parent_id(id, name)
      `,
    )
    .eq('budget_id', budgetId)

  console.log('SEARCHING FOR', searchText)

  if (searchText) query = query.ilike('name', `%${searchText}%`)

  const {data, error} = await query.order('name', {ascending: true})

  /// DEV
  logRes('getCategories', data, error)

  return data
}
