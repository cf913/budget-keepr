import {useQuery} from '@tanstack/react-query'
import {
  getAllTimeSpend,
  getAvgDailySpend,
  getCurrentWeekSpend,
  getThisYearSpend,
  getTodaySpend,
} from '@/data/analytics'
import {toMoney} from '@/utils/helpers'
import {ThemedView} from './ThemedView'
import dayjs from 'dayjs'
import {StyleSheet} from 'react-native'
import {PADDING} from '@/constants/Styles'
import Card from './Cards/Card'

export const AnalyticsQueryKeys = [
  'getAllTimeSpend',
  'getAvgDailySpend',
  'getCurrentWeekSpend',
  'getTodaySpend',
]

export default function Analytics({counter}: {counter: number}) {
  console.log('counter', counter)

  // ALL TIME
  // const allTimeData = useQuery({
  //   queryKey: ['getAllTimeSpend', counter],
  //   queryFn: getAllTimeSpend,
  // })

  // THIS YEAR
  const allTimeData = useQuery({
    queryKey: ['getAllTimeSpend', counter],
    queryFn: getThisYearSpend,
  })

  const avgDailyData = useQuery({
    queryKey: ['getAvgDailySpend', counter],
    queryFn: getAvgDailySpend,
  })

  const currentWeekData = useQuery({
    queryKey: ['getCurrentWeekSpend', counter],
    queryFn: getCurrentWeekSpend,
  })

  const todayData = useQuery({
    queryKey: ['getTodaySpend', counter],
    queryFn: getTodaySpend,
  })

  // useEffect(() => {
  //   allTimeData.data && allTimeData.refetch()
  //   avgDailyData.data && avgDailyData.refetch()
  //   currentWeekData.data && currentWeekData.refetch()
  //   todayData.data && todayData.refetch()
  // }, [counter])

  const dailySpend =
    allTimeData.data /
    (dayjs().diff(new Date(avgDailyData.data?.created_at), 'day') || 1)

  // console.log('allTimeData', allTimeData)
  // console.log('dailySpend', dailySpend)

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
        title={'Avg. Daily'}
        value={toMoney(dailySpend, true)}
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
      {/* </ThemedView>
      <ThemedView style={{flexDirection: 'row', gap: PADDING}}> */}
      {/* <Card title={'All Time Spend'} value={toMoney(allTimeSpend)} />
      <Card title={'Average Daily'} value={toMoney(dailySpend)} /> */}
      {/* </ThemedView> */}
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
