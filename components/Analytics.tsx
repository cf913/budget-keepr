import {useQuery} from '@tanstack/react-query'
import {ThemedText} from './ThemedText'
import {
  getAllTimeSpend,
  getAvgDailySpend,
  getCurrentWeekSpend,
  getTodaySpend,
} from '@/data/analytics'
import {toMoney} from '@/utils/helpers'
import {ThemedView} from './ThemedView'
import {useEffect} from 'react'
import dayjs from 'dayjs'
import {StyleSheet} from 'react-native'
import {PADDING, STYLES} from '@/constants/Styles'
import {useThemeColor} from '@/hooks/useThemeColor'
import Card from './Cards/Card'

export default function Analytics({counter}: {counter: number}) {
  const backgroundColor = useThemeColor({}, 'bg_secondary')
  const allTimeData = useQuery({
    queryKey: ['getAllTimeSpend'],
    queryFn: getAllTimeSpend,
    staleTime: 1000,
  })

  const avgDailyData = useQuery({
    queryKey: ['getAvgDailySpend'],
    queryFn: getAvgDailySpend,
    staleTime: 1000,
  })

  const currentWeekData = useQuery({
    queryKey: ['getCurrentWeekSpend'],
    queryFn: getCurrentWeekSpend,
    staleTime: 1000,
  })

  const todayData = useQuery({
    queryKey: ['getTodaySpend'],
    queryFn: getTodaySpend,
    staleTime: 1000,
  })

  useEffect(() => {
    allTimeData.data && allTimeData.refetch()
    avgDailyData.data && avgDailyData.refetch()
  }, [counter])

  const dailySpend =
    allTimeData.data /
    dayjs().diff(new Date(avgDailyData.data?.created_at), 'day')

  console.log('allTimeData', allTimeData)
  console.log('dailySpend', dailySpend)

  return (
    <ThemedView style={styles.container}>
      {/* <ThemedView style={{flexDirection: 'row', gap: PADDING}}> */}
      <Card
        loading={allTimeData.isLoading}
        title={'All Time'}
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
    gap: PADDING,
    flexGrow: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
})
