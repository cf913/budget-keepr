import { PADDING } from '@/constants/Styles'
import {
  getAvgDailySpend,
  getCurrentMonthSpend,
  getCurrentWeekSpend,
  getLastWeekSpend,
  getThisYearSpend,
  getTodaySpend,
} from '@/data/analytics'
import { toMoney } from '@/utils/helpers'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { StyleSheet } from 'react-native'
import Card from './Cards/Card'
import { ThemedView } from './ThemedView'
import CardVersus from './Cards/CardVersus'
import { toast } from '@backpackapp-io/react-native-toast'
import Toasty from '@/lib/Toasty'

export const AnalyticsQueryKeys = [
  'AnalyticsGetAllTimeSpend',
  'AnalyticsGetAvgDailySpend',
  'AnalyticsGetCurrentWeekSpend',
  'AnalyticsGetTodaySpend',
  'AnalyticsGetCurrentMonthSpend',
  'AnalyticsGetLastWeekSpend',
  'AnalyticsGetBreakdown',
]

export default function Analytics({
  counter,
  budget_id,
}: {
  counter: number
  budget_id?: string
}) {
  // THIS YEAR
  const allTimeData = useQuery({
    queryKey: ['AnalyticsGetAllTimeSpend', counter, budget_id],
    queryFn: () => getThisYearSpend(budget_id),
  })

  const avgDailyData = useQuery({
    queryKey: ['AnalyticsGetAvgDailySpend', counter, budget_id],
    queryFn: () => getAvgDailySpend(budget_id),
  })

  const currentWeekData = useQuery({
    queryKey: ['AnalyticsGetCurrentWeekSpend', counter, budget_id],
    queryFn: () => getCurrentWeekSpend(budget_id),
  })

  const lastWeekData = useQuery({
    queryKey: ['AnalyticsGetLastWeekSpend', counter, budget_id],
    queryFn: () => getLastWeekSpend(budget_id),
  })

  const currentMonthData = useQuery({
    queryKey: ['AnalyticsGetCurrentMonthSpend', counter, budget_id],
    queryFn: () => getCurrentMonthSpend(budget_id),
  })

  const todayData = useQuery({
    queryKey: ['AnalyticsGetTodaySpend', counter, budget_id],
    queryFn: () => getTodaySpend(budget_id),
  })

  const diffRaw = dayjs()
    .endOf('day')
    .diff(dayjs(avgDailyData.data?.created_at).startOf('day'), 'day', true)

  // number of full days since the first transaction
  // including day of first transaction and today
  const diff = Math.ceil(diffRaw)

  const dailySpend = allTimeData.data / (diff || 1)

  if (lastWeekData.error || currentWeekData.error || currentMonthData.error) {
    Toasty.error(
      'Analytics error: ' +
      (lastWeekData.error?.message ||
        currentWeekData.error?.message ||
        currentMonthData.error?.message),
    )
  }

  return (
    <ThemedView>
      <ThemedView style={styles.container}>
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
        {budget_id ? <CardVersus counter={counter} /> : null}
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
