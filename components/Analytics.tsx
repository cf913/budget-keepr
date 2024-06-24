import { useQuery } from '@tanstack/react-query'
import {
  getAvgDailySpend,
  getCurrentMonthSpend,
  getCurrentWeekSpend,
  getThisYearSpend,
  getTodaySpend,
  getLastWeekSpend,
} from '@/data/analytics'
import { toMoney } from '@/utils/helpers'
import { ThemedView } from './ThemedView'
import dayjs from 'dayjs'
import { StyleSheet } from 'react-native'
import { PADDING } from '@/constants/Styles'
import Card from './Cards/Card'
import { useLocalSettings } from '@/stores/localSettings'

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

  return (
    <ThemedView style={styles.container}>
      {/* <ThemedView style={{flexDirection: 'row', gap: PADDING}}> */}
      <Card
        loading={allTimeData.isLoading}
        title={'This Year'}
        value={toMoney(allTimeData.data, true)}
      />
      <Card
        loading={avgDailyData.isLoading}
        title={'All Time Daily Avg.'}
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
      {/* </ThemedView>
      <ThemedView style={{flexDirection: 'row', gap: PADDING}}> */}
      {/* <Card title={'All Time Spend'} value={toMoney(allTimeSpend)} />
      <Card title={'Average Daily'} value={toMoney(dailySpend)} /> */}
      {/* </ThemedView> */}
      {/* <BarChart data={data} /> */}
      {/* <LineChart data={data} />
      <PieChart data={data} />
      <PopulationPyramid
        data={[
          {left: 10, right: 12},
          {left: 9, right: 8},
        ]}
      />
      <BarChart data={data} horizontal />
      <LineChart data={data} areaChart />
      <PieChart data={data} donut /> */}
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: PADDING / 2,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
})
