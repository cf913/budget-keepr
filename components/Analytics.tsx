import {useQuery} from '@tanstack/react-query'
import {
  getAllTimeSpend,
  getAvgDailySpend,
  getCurrentMonthSpend,
  getCurrentWeekSpend,
  getThisYearSpend,
  getTodaySpend,
  getLastWeekSpend,
  getWeeklyBreakdown,
} from '@/data/analytics'
import {toMoney} from '@/utils/helpers'
import {ThemedView} from './ThemedView'
import dayjs from 'dayjs'
import {StyleSheet} from 'react-native'
import {PADDING} from '@/constants/Styles'
import Card from './Cards/Card'
import {useLocalSettings} from '@/stores/localSettings'

import {
  BarChart,
  LineChart,
  PieChart,
  PopulationPyramid,
} from 'react-native-gifted-charts'
import {useMemo} from 'react'
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

export default function Analytics({counter}: {counter: number}) {
  const {defaultBudget} = useLocalSettings()

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

  const dailySpend =
    allTimeData.data /
    (dayjs().diff(new Date(avgDailyData.data?.created_at), 'day') || 1)

  return (
    <ThemedView style={styles.container}>
      {/* <ThemedView style={{flexDirection: 'row', gap: PADDING}}> */}
      <Card
        loading={allTimeData.isLoading}
        title={'This Year'}
        value={toMoney(allTimeData.data, true)}
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
      <Card
        loading={avgDailyData.isLoading}
        title={'Avg. Daily'}
        value={toMoney(dailySpend, true)}
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
    flexGrow: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
})
