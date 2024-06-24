import { PADDING, TYPO } from '@/constants/Styles'
import { useTempStore } from '@/stores/tempStore'
import {
  capitalizeFirstLetter,
  getDayJSFrequencyFromString,
  getTimeStringFromFrequency,
  toMoney,
} from '@/utils/helpers'
import DateTimePicker from '@react-native-community/datetimepicker'
import dayjs from 'dayjs'
import { router } from 'expo-router'
import { useMemo, useState } from 'react'
import { Pressable } from 'react-native'
import { FadeInUp, FadeOutUp } from 'react-native-reanimated'
import { ThemedButtonCompact } from './Buttons/ThemedButtonCompact'
import ThemedCheckbox from './Inputs/ThemedCheckbox'
import Padder from './Layout/Padder'
import List from './Lists/List'
import ListItem from './Lists/ListItem'
import PreviewDisclaimer from './Preview/PreviewDisclaimer'
import { SubCategory } from './RecentEntries'
import { ThemedText } from './ThemedText'
import { AnimatedView, ThemedView } from './ThemedView'

export type Frequency =
  | 'daily'
  | 'weekly'
  | 'fortnightly'
  | 'monthly'
  | 'quarterly'
  | 'biannually'
  | 'yearly'

export default function RecurringInputs({
  isRecurring,
  setRecurring,
  subCategory,
  amount,
}: {
  isRecurring: boolean
  setRecurring: (v: boolean) => void
  subCategory: null | SubCategory
  amount: string
}) {
  const [date, setDate] = useState<Date>(new Date())
  const { selectedFrequency } = useTempStore()

  const onChange = (event: any, selectedDate?: Date) => {
    if (!selectedDate) return
    setDate(selectedDate)
  }

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
        style={{ flexDirection: 'row', alignItems: 'center', zIndex: 2 }}
      >
        <ThemedCheckbox
          checked={isRecurring}
          onChange={() => setRecurring(!isRecurring)}
        />
        <Padder style={{ width: PADDING / 2 }} />
        <Pressable
          onPress={() => setRecurring(!isRecurring)}
          hitSlop={10}
          style={{ zIndex: 2 }}
        >
          <ThemedText>Recurring?</ThemedText>
        </Pressable>
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
          <ThemedView
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <ThemedText>Start Date</ThemedText>
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode={'date'}
              is24Hour={true}
              onChange={onChange}
              key={date.toISOString()}
            />
          </ThemedView>
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
                NEXT {getTimeStringFromFrequency(selectedFrequency).toUpperCase()}
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
              <Padder h={0.5} />
              <PreviewDisclaimer />
            </>
          ) : null}
        </AnimatedView>
      ) : null}
    </ThemedView>
  )
}
