import { TYPO } from '@/constants/Styles'
import { useThemeColor } from '@/hooks/useThemeColor'
import { useTempStore } from '@/stores/tempStore'
import {
  capitalizeFirstLetter,
  getDayJSFrequencyFromString,
  getTimeStringFromFrequency,
  toMoney,
} from '@/utils/helpers'
import dayjs from 'dayjs'
import { router } from 'expo-router'
import { useMemo } from 'react'
import { Pressable, Switch } from 'react-native'
import { FadeInUp, FadeOutUp } from 'react-native-reanimated'
import { ThemedButtonCompact } from './Buttons/ThemedButtonCompact'
import List from './Lists/List'
import ListItem from './Lists/ListItem'
import PreviewDisclaimer from './Preview/PreviewDisclaimer'
import { SubCategory } from './RecentEntries'
import { ThemedText } from './ThemedText'
import { AnimatedView, ThemedView } from './ThemedView'
import { Padder } from './Layout'

export type Frequency =
  | 'daily'
  | 'weekly'
  | 'fortnightly'
  | 'monthly'
  | 'quarterly'
  | 'biannually'
  | 'yearly'

export default function RecurringInputs({
  date,
  // setDate,
  recurring = false,
  isRecurring,
  setRecurring,
  subCategory,
  amount,
}: {
  date: Date
  setDate: (v: Date) => void
  recurring?: boolean
  isRecurring: boolean
  setRecurring: (v: boolean) => void
  subCategory: null | SubCategory
  amount: string
}) {
  const { selectedFrequency } = useTempStore()
  const tintColor = useThemeColor({}, 'tint')

  // const onChange = (_event: any, selectedDate?: Date) => {
  //   if (!selectedDate) return
  //   setDate(selectedDate)
  // }

  const nextEntry = useMemo(() => {
    const [unit, frequencyString] =
      getDayJSFrequencyFromString(selectedFrequency)
    const nextDate = dayjs(date).add(unit, frequencyString)
    return nextDate
  }, [date, selectedFrequency])

  const onSelectFrequency = () => {
    return router.navigate('/(main)/select-frequency')
  }

  return (
    <ThemedView>
      <ThemedView
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Pressable
          onPress={() => setRecurring(!isRecurring)}
          hitSlop={10}
          style={{ zIndex: 2 }}
        >
          <ThemedText>Recurring?</ThemedText>
        </Pressable>
        <Switch
          trackColor={{ true: tintColor }}
          ios_backgroundColor="#3e3e3e"
          onValueChange={() => setRecurring(!isRecurring)}
          value={isRecurring}
          disabled={recurring}
        />
        {/* <ThemedCheckbox
          checked={isRecurring}
          onChange={() => setRecurring(!isRecurring)}
        /> */}
      </ThemedView>
      <Padder />
      {isRecurring ? (
        <AnimatedView entering={FadeInUp} exiting={FadeOutUp.duration(200)}>
          <ThemedView
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <ThemedText>Frequency</ThemedText>
            <ThemedButtonCompact
              onPress={onSelectFrequency}
              title={capitalizeFirstLetter(selectedFrequency)}
            />
          </ThemedView>
          <Padder />
          {subCategory ? (
            <>
              <Padder h={1} />
              <ThemedText
                style={{
                  textAlign: 'center',
                  letterSpacing: 3,
                  ...TYPO.small,
                }}
              >
                PREVIEW
              </ThemedText>
              <Padder h={0.5} />
              <List>
                <ListItem
                  lastItem
                  title={subCategory.name}
                  description={dayjs(date).format('HH:mm - ddd D MMM')}
                  category={subCategory.category}
                  // description={entry.categories.name}
                  right={toMoney(+amount * 100)}
                />
              </List>
              <Padder />
              <ThemedText
                style={{
                  textAlign: 'center',
                  letterSpacing: 3,
                  ...TYPO.small,
                }}
              >
                NEXT{' '}
                {getTimeStringFromFrequency(selectedFrequency).toUpperCase()}
              </ThemedText>
              <Padder h={0.5} />
              <List>
                <ListItem
                  lastItem
                  title={subCategory.name}
                  description={nextEntry.format(
                    selectedFrequency === 'yearly'
                      ? 'HH:mm - ddd D MMM YYYY'
                      : 'HH:mm - ddd D MMM',
                  )}
                  category={subCategory.category}
                  // description={entry.categories.name}
                  right={toMoney(+amount * 100)}
                />
              </List>
              {!recurring ? (
                <>
                  <Padder h={0.5} />
                  <PreviewDisclaimer />
                </>
              ) : null}
            </>
          ) : null}
        </AnimatedView>
      ) : null}
    </ThemedView>
  )
}
