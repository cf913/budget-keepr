import {useThemeColor} from '@/hooks/useThemeColor'
import {ThemedText} from '../ThemedText'
import {AnimatedView, ThemedView} from '../ThemedView'
import {PADDING, RADIUS, STYLES, TYPO} from '@/constants/Styles'
import {StyleSheet} from 'react-native'
import Padder from '../Layout/Padder'
import {Loader} from '../Loader'
import {FlipInXUp, FlipOutXDown, FlipOutXUp} from 'react-native-reanimated'
import {useQuery} from '@tanstack/react-query'
import {getWeeklyBreakdown} from '@/data/analytics'
import {useLocalSettings} from '@/stores/localSettings'
import {Fragment, useMemo} from 'react'
import {toMoney} from '@/utils/helpers'
import {BarChart} from 'react-native-gifted-charts'

export default function Card({counter}: {counter: number}) {
  const {defaultBudget} = useLocalSettings()
  const backgroundColor = useThemeColor({}, 'bg_secondary')
  const textColor = useThemeColor({}, 'text')
  const tintColor = useThemeColor({}, 'mid')

  const weeklyData = useQuery({
    queryKey: ['getWeeklyBreakdown', counter],
    queryFn: () => getWeeklyBreakdown(defaultBudget?.id),
  })

  console.log('weeklydata', weeklyData.data)

  const data = useMemo(() => {
    return weeklyData.data?.map((item: any) => ({
      value: item.sum,
      label: item.categories.name,
      frontColor: item.categories.color,
    }))
  }, [weeklyData.data])

  const total = data?.reduce((acc, next) => acc + next.value, 0)

  return (
    <ThemedView style={[styles.card, {backgroundColor}]}>
      {(data || []).map((item: any) => (
        <ThemedView key={item.name} style={styles.inner}>
          <ThemedText style={[styles.title, {color: item.frontColor}]}>
            {item.label}
          </ThemedText>
          <Padder h={0.3} />
          {weeklyData.isLoading ? (
            <Loader size="small" />
          ) : (
            <AnimatedView entering={FlipInXUp} exiting={FlipOutXDown}>
              <ThemedText style={[styles.value, {color: textColor}]}>
                {toMoney(item.value, true)}
              </ThemedText>
              <ThemedText style={[styles.value, {color: textColor}]}>
                {/* get percentage of value from total */}
                {((item.value / (total || 1)) * 100).toFixed(2)}%
              </ThemedText>
            </AnimatedView>
          )}
        </ThemedView>
      ))}
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  card: {
    ...STYLES.shadow,
    borderRadius: RADIUS,
    flexDirection: 'row',
    flexGrow: 1,
    alignItems: 'center',
    padding: PADDING,
    width: '100%',
  },
  inner: {
    columnGap: PADDING,
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...TYPO.small,
    fontWeight: 'bold',
    // textTransform: 'uppercase',
    // letterSpacing: 2,
  },
  value: {
    ...TYPO.card_value,
  },
})
