import React from 'react'
import { StyleSheet } from 'react-native'
import { useQueries } from '@tanstack/react-query'
import dayjs from 'dayjs'

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
import Card from './Cards/Card'
import { ThemedView } from './ThemedView'
import CardVersus from './Cards/CardVersus'
import Toasty from '@/lib/Toasty'

export const AnalyticsQueryKeys = {
  AllTimeSpend: 'AnalyticsGetAllTimeSpend',
  AvgDailySpend: 'AnalyticsGetAvgDailySpend',
  CurrentWeekSpend: 'AnalyticsGetCurrentWeekSpend',
  TodaySpend: 'AnalyticsGetTodaySpend',
  CurrentMonthSpend: 'AnalyticsGetCurrentMonthSpend',
  LastWeekSpend: 'AnalyticsGetLastWeekSpend',
  Breakdown: 'AnalyticsGetBreakdown',
}

interface AnalyticsProps {
  counter: number
  budget_id?: string
}

export default function Analytics({ counter, budget_id }: AnalyticsProps) {
  const queries = useQueries({
    queries: [
      {
        queryKey: [AnalyticsQueryKeys.AllTimeSpend, counter, budget_id],
        queryFn: () => getThisYearSpend(budget_id),
      },
      {
        queryKey: [AnalyticsQueryKeys.AvgDailySpend, counter, budget_id],
        queryFn: () => getAvgDailySpend(budget_id),
      },
      {
        queryKey: [AnalyticsQueryKeys.CurrentWeekSpend, counter, budget_id],
        queryFn: () => getCurrentWeekSpend(budget_id),
      },
      {
        queryKey: [AnalyticsQueryKeys.LastWeekSpend, counter, budget_id],
        queryFn: () => getLastWeekSpend(budget_id),
      },
      {
        queryKey: [AnalyticsQueryKeys.CurrentMonthSpend, counter, budget_id],
        queryFn: () => getCurrentMonthSpend(budget_id),
      },
      {
        queryKey: [AnalyticsQueryKeys.TodaySpend, counter, budget_id],
        queryFn: () => getTodaySpend(budget_id),
      },
    ],
  })

  const [
    allTimeData,
    avgDailyData,
    currentWeekData,
    lastWeekData,
    currentMonthData,
    todayData,
  ] = queries

  React.useEffect(() => {
    const error = queries.find(query => query.error)?.error
    if (error) {
      Toasty.error(`Analytics error: ${error.message}`)
    }
  }, [queries])

  const diffRaw = dayjs()
    .endOf('day')
    .diff(dayjs(avgDailyData.data?.created_at).startOf('day'), 'day', true)

  const diff = Math.ceil(diffRaw)
  const dailySpend = allTimeData.data / (diff || 1)

  const renderCard = (title: string, value: number, loading: boolean) => (
    <Card loading={loading} title={title} value={toMoney(value, true)} />
  )

  return (
    <ThemedView>
      <ThemedView style={styles.container}>
        {renderCard('This Year', allTimeData.data, allTimeData.isLoading)}
        {renderCard('Daily Avg.', dailySpend, avgDailyData.isLoading)}
        {renderCard(
          'This Month',
          currentMonthData.data,
          currentMonthData.isLoading,
        )}
        {renderCard('Last Week', lastWeekData.data, lastWeekData.isLoading)}
        {renderCard(
          'This Week',
          currentWeekData.data,
          currentWeekData.isLoading,
        )}
        {renderCard('Today', todayData.data, todayData.isLoading)}
        {budget_id && <CardVersus counter={counter} />}
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
