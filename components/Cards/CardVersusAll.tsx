import { PADDING, RADIUS, TYPO } from '@/constants/Styles'
import { getBreakdown } from '@/data/analytics'
import { useThemeColor } from '@/hooks/useThemeColor'
import { sortByKey, toMoney } from '@/utils/helpers'
import SegmentedControl from '@react-native-segmented-control/segmented-control'
import { useQuery } from '@tanstack/react-query'
import React, { Fragment, useMemo, useState } from 'react'
import { StyleSheet, useWindowDimensions } from 'react-native'
import { Loader } from '../Loader'
import { ThemedText } from '../ThemedText'
import { AnimatedView, ThemedView } from '../ThemedView'
import { FadeIn, FadeOut } from 'react-native-reanimated'
import { ScrollView } from 'react-native-gesture-handler'
import { Padder } from '../Layout'

type CardVersusProps = {
  counter: number
}

export default function CardVersus({ counter }: CardVersusProps) {
  const dims = useWindowDimensions()
  const TIME_FRAMES = ['Week', 'Month', 'Year']
  const [maxAmountWidth, setMaxAmountWidth] = useState<number[] | null>(null)
  const [headerHeight, setHeaderHeight] = useState<number | null>(null)
  const [timeFrameIndex, setTimeFrameIndex] = useState(1)

  const tintColor = useThemeColor({}, 'tint')
  const backgroundColor = useThemeColor({}, 'bg_secondary')
  const textColor = useThemeColor({}, 'text')
  const midColor = useThemeColor({}, 'mid')

  const timeframe = TIME_FRAMES[timeFrameIndex].toLowerCase()

  const weeklyData = useQuery({
    queryKey: ['getBreakdown', counter, timeframe],
    queryFn: () => getBreakdown(null, timeframe),
  })

  const [data, total] = useMemo(() => {
    const arr: any[] =
      weeklyData.data?.map((item: any) => ({
        value: item.sum,
        label: item.category.name,
        frontColor: item.category.color,
      })) || []

    const total = arr.reduce((acc, next) => acc + next.value, 0)

    return [sortByKey(arr, 'value'), total]
  }, [weeklyData.data])

  const normalizedWidth = (percentage: number) => {
    if (!maxAmountWidth) return 0
    // fullscreen - padding h content - padding h inner card - width of max amount - space between bar and max amount
    const fullWidth =
      dims.width -
      2 * PADDING -
      2 * (PADDING / 1.5) -
      maxAmountWidth[0] -
      PADDING
    const width = (percentage * fullWidth) / maxAmountWidth[1]
    return width
  }

  return (
    <ThemedView style={[styles.card, { backgroundColor }]}>
      {/* EMPTY STATE */}
      {!data?.length && !weeklyData.isLoading && headerHeight ? (
        <Fragment>
          <Padder hv={headerHeight} />
          <ThemedText style={[styles.title, { color: midColor }]}>
            0 entries found this {TIME_FRAMES[timeFrameIndex]}. Congrats! 🎉
          </ThemedText>
          <Padder h={0.3} />
        </Fragment>
      ) : null}
      {/* WITH DATA */}
      {data && data.length && headerHeight ? (
        // TOP 4
        <ScrollView showsVerticalScrollIndicator={false}>
          <Padder hv={headerHeight} />
          {data.map((item: any, index: number) => {
            const percentage = (item.value / (total || 1)) * 100
            return (
              <ThemedView key={item.label} style={styles.inner}>
                <ThemedText style={[styles.title, { color: textColor }]}>
                  {item.label}
                </ThemedText>
                <Padder hv={1} />
                {weeklyData.isLoading ? (
                  <Loader size="small" />
                ) : (
                  <AnimatedView entering={FadeIn} exiting={FadeOut}>
                    <ThemedView
                      style={{
                        width: '100%',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        backgroundColor: 'transparent',
                      }}
                    >
                      <ThemedView
                        style={{
                          width: normalizedWidth(percentage),
                          backgroundColor: item.frontColor,
                          borderRadius: 6,
                          height: PADDING,
                        }}
                      ></ThemedView>
                      <ThemedText
                        style={{ color: tintColor }}
                        onLayout={event => {
                          if (index > 0) return
                          const { width } = event.nativeEvent.layout
                          setMaxAmountWidth([width, percentage])
                        }}
                      >
                        {toMoney(item.value, true)}
                      </ThemedText>
                    </ThemedView>
                    <Padder hv={8} />
                  </AnimatedView>
                )}
              </ThemedView>
            )
          })}
        </ScrollView>
      ) : null}
      <ThemedView
        style={{
          backgroundColor: 'transparent',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          padding: PADDING / 2,
          zIndex: 2,
        }}
        onLayout={event => {
          const { height } = event.nativeEvent.layout
          setHeaderHeight(height - PADDING / 1.5) // card.paddingVertical
        }}
      >
        <SegmentedControl
          values={TIME_FRAMES}
          selectedIndex={timeFrameIndex}
          backgroundColor={backgroundColor}
          onChange={(event: {
            nativeEvent: { selectedSegmentIndex: number }
          }) => {
            setTimeFrameIndex(event.nativeEvent.selectedSegmentIndex)
          }}
        />
      </ThemedView>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  card: {
    // ...STYLES.shadow,
    borderRadius: RADIUS,
    flexGrow: 1,
    paddingHorizontal: PADDING / 1.5,
    paddingVertical: PADDING / 1.5,
    paddingBottom: 0,
    width: '100%',
    height: 0,
    position: 'relative',
  },
  inner: {
    columnGap: PADDING,
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  title: {
    ...TYPO.small,
    fontWeight: 'bold',
    // textTransform: 'uppercase',
    // letterSpacing: 2,
  },
  value: {
    ...TYPO.card_value_compact,
  },
})
