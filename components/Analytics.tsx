import {useQuery} from '@tanstack/react-query'
import {ThemedText} from './ThemedText'
import {getAllTimeSpend, getAvgDailySpend} from '@/data/analytics'
import {toMoney} from '@/utils/helpers'
import {ThemedView} from './ThemedView'
import {useEffect} from 'react'
import dayjs from 'dayjs'

export default function Analytics({counter}: {counter: number}) {
  const {
    data: allTimeSpend,
    error: errorAllTime,
    refetch: refetchAllTime,
  } = useQuery({
    queryKey: ['getAllTimeSpend'],
    queryFn: getAllTimeSpend,
    staleTime: 1000,
  })

  const {
    data: avgDailySpend,
    error: errorAvgDaily,
    refetch: refetchAvgDailySpend,
  } = useQuery({
    queryKey: ['getAvgDailySpend'],
    queryFn: getAvgDailySpend,
    staleTime: 1000,
  })

  useEffect(() => {
    allTimeSpend && refetchAllTime()
    avgDailySpend && refetchAvgDailySpend()
  }, [counter])

  const dailySpend =
    allTimeSpend / dayjs().diff(new Date(avgDailySpend?.created_at), 'day')

  return (
    <ThemedView>
      <ThemedText>{counter}</ThemedText>
      <ThemedText>All Time Spend: {toMoney(allTimeSpend)}</ThemedText>
      <ThemedText>Average Daily Spend: {toMoney(dailySpend)}</ThemedText>
    </ThemedView>
  )
}
