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
import {sortByKey, toMoney} from '@/utils/helpers'

export default function CardVersus({counter}: {counter: number}) {
  const {defaultBudget} = useLocalSettings()
  const backgroundColor = useThemeColor({}, 'bg_secondary')
  const textColor = useThemeColor({}, 'text')
  const tintColor = useThemeColor({}, 'mid')

  const weeklyData = useQuery({
    queryKey: ['getWeeklyBreakdown', counter],
    queryFn: () => getWeeklyBreakdown(defaultBudget?.id),
  })

  console.log('weeklydata', weeklyData.data)

  const [data, total] = useMemo(() => {
    const arr: any[] =
      weeklyData.data?.map((item: any) => ({
        value: item.sum,
        label: item.categories.name,
        frontColor: item.categories.color,
      })) || []

    const total = arr.reduce((acc, next) => acc + next.value, 0)

    return [sortByKey(arr, 'value'), total]
  }, [weeklyData.data])

  return (
    <ThemedView style={[styles.card, {backgroundColor}]}>
      {/* EMPTY STATE */}
      {!data?.length ? (
        <Fragment>
          <ThemedText style={[styles.title, {color: tintColor}]}>
            No entries found this week. Congrats! 🎉
          </ThemedText>
          <Padder h={0.3} />
        </Fragment>
      ) : null}
      {/* WITH DATA */}
      {data && data.length
        ? data.map((item: any) => (
            <ThemedView key={item.label} style={styles.inner}>
              <ThemedText style={[styles.title, {color: item.frontColor}]}>
                {item.label}
              </ThemedText>
              <Padder h={0.3} />
              {weeklyData.isLoading ? (
                <Loader size="small" />
              ) : (
                <AnimatedView
                  entering={FlipInXUp}
                  exiting={FlipOutXDown}
                  style={{alignItems: 'center'}}
                >
                  <ThemedText style={[styles.value, {color: textColor}]}>
                    {toMoney(item.value, true)}
                  </ThemedText>
                  <ThemedText
                    style={[
                      {},
                      {
                        color: textColor,
                        opacity: 0.4,
                        fontFamily: 'Space Mono',
                        fontSize: 14,
                        lineHeight: 20,
                      },
                    ]}
                  >
                    {/* get percentage of value from total */}
                    {((item.value / (total || 1)) * 100).toFixed(2)}%
                  </ThemedText>
                </AnimatedView>
              )}
            </ThemedView>
          ))
        : null}
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
    paddingHorizontal: PADDING,
    paddingVertical: PADDING / 1.5,
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
