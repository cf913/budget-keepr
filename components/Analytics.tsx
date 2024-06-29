import { PADDING } from '@/constants/Styles'
import {
  getAvgDailySpend,
  getCurrentMonthSpend,
  getCurrentWeekSpend,
  getLastWeekSpend,
  getThisYearSpend,
  getTodaySpend,
} from '@/data/analytics'
import { useLocalSettings } from '@/stores/localSettings'
import { toMoney } from '@/utils/helpers'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { StyleSheet } from 'react-native'
import Card from './Cards/Card'
import { ThemedView } from './ThemedView'

import CardVersus from './Cards/CardVersus'

export const AnalyticsQueryKeys = [
  'getAllTimeSpend',
  'getAvgDailySpend',
  'getCurrentWeekSpend',
  'getTodaySpend',
  'getCurrentMonthSpend',
  'getLastWeekSpend',
  'getWeeklyBreakdown',
]

export default function Analytics({ counter }: { counter: number }) {
  const { defaultBudget } = useLocalSettings()

  // ALL TIME
  // const allTimeData = useQuery({
  //   queryKey: ['getAllTimeSpend', counter],
  //   queryFn: getAllTimeSpend,
  // })

  // THIS YEAR
  const allTimeData = useQuery({
    queryKey: ['getAllTimeSpend', counter],
    queryFn: () => getThisYearSpend(defaultBudget?.id),
  })

  const avgDailyData = useQuery({
    queryKey: ['getAvgDailySpend', counter],
    queryFn: () => getAvgDailySpend(defaultBudget?.id),
  })

  const currentWeekData = useQuery({
    queryKey: ['getCurrentWeekSpend', counter],
    queryFn: () => getCurrentWeekSpend(defaultBudget?.id),
  })

  const lastWeekData = useQuery({
    queryKey: ['getLastWeekSpend', counter],
    queryFn: () => getLastWeekSpend(defaultBudget?.id),
  })

  const currentMonthData = useQuery({
    queryKey: ['getCurrentMonthSpend', counter],
    queryFn: () => getCurrentMonthSpend(defaultBudget?.id),
  })

  const todayData = useQuery({
    queryKey: ['getTodaySpend', counter],
    queryFn: () => getTodaySpend(defaultBudget?.id),
  })

  const diffRaw = dayjs()
    .endOf('day')
    .diff(dayjs(avgDailyData.data?.created_at).startOf('day'), 'day', true)

  // number of full days since the first transaction
  // including day of first transaction and today
  const diff = Math.ceil(diffRaw)

  const dailySpend = allTimeData.data / (diff || 1)

  if (lastWeekData.error || currentWeekData.error || currentMonthData.error) {
    alert(
      lastWeekData.error?.message ||
      currentWeekData.error?.message ||
      currentMonthData.error?.message,
    )
  }

  return (
    <ThemedView>
      <ThemedView style={styles.container}>
        {/* <ThemedView style={{flexDirection: 'row', gap: PADDING}}> */}
        <Card
          loading={allTimeData.isLoading}
          title={'This Year'}
          value={toMoney(allTimeData.data, true)}
        />
        <Card
          loading={avgDailyData.isLoading}
          title={'Daily Avg.'}
          value={toMoney(dailySpend, true)}
        />
        <Card
          loading={currentMonthData.isLoading}
          title={'This Month'}
          value={toMoney(currentMonthData.data, true)}
        />
        <Card
          loading={lastWeekData.isLoading}
          title={'Last Week'}
          value={toMoney(lastWeekData.data, true)}
        />
        <Card
          loading={currentWeekData.isLoading}
          title={'This Week'}
          value={toMoney(currentWeekData.data, true)}
        />
        <Card
          loading={todayData.isLoading}
          title={'Today'}
          value={toMoney(todayData.data, true)}
        />
        <CardVersus counter={counter} />
      </ThemedView>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: PADDING / 1.5,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
})
