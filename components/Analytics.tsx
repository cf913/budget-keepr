import {useQuery} from '@tanstack/react-query'
import {ThemedText} from './ThemedText'
import {getAllTimeSpend, getAvgDailySpend} from '@/data/analytics'
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
    <ThemedView style={styles.container}>
      {/* <ThemedView style={{flexDirection: 'row', gap: PADDING}}> */}
      <Card title={'All Time Spend'} value={toMoney(allTimeSpend)} />
      <Card title={'Average Daily'} value={toMoney(dailySpend)} />
      {/* </ThemedView>
      <ThemedView style={{flexDirection: 'row', gap: PADDING}}> */}
      <Card title={'All Time Spend'} value={toMoney(allTimeSpend)} />
      <Card title={'Average Daily'} value={toMoney(dailySpend)} />
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
