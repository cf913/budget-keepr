import { PADDING, TYPO } from '@/constants/Styles'
import { useTempStore } from '@/stores/tempStore'
import {
  capitalizeFirstLetter,
  getDayJSFrequencyFromString,
  toMoney,
} from '@/utils/helpers'
import DateTimePicker from '@react-native-community/datetimepicker'
import dayjs from 'dayjs'
import { Link } from 'expo-router'
import { useMemo, useState } from 'react'
import { Pressable } from 'react-native'
import ThemedCheckbox from './Inputs/ThemedCheckbox'
import Padder from './Layout/Padder'
import List from './Lists/List'
import ListItem from './Lists/ListItem'
import { SubCategory } from './RecentEntries'
import { ThemedText } from './ThemedText'
import { ThemedView } from './ThemedView'

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
    console.log(nextDate)
    return nextDate
  }, [date, selectedFrequency])

  console.log('nextEntry', nextEntry)

  return (
    <ThemedView>
      <ThemedView style={{ flexDirection: 'row', alignItems: 'center' }}>
        <ThemedCheckbox
          checked={isRecurring}
          onChange={() => setRecurring(!isRecurring)}
        />
        <Padder style={{ width: PADDING / 2 }} />
        <ThemedText>Recurring?</ThemedText>
      </ThemedView>
      <Padder />
      {isRecurring ? (
        <>
          <ThemedView
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <ThemedText>Frequency</ThemedText>
            <Link href="/(main)/select-frequency" asChild>
              <Pressable
                style={{
                  padding: PADDING / 4,
                  paddingHorizontal: PADDING,
                  borderWidth: 1,
                  borderColor: '#ccc',
                  borderRadius: 8,
                }}
              >
                <ThemedText>
                  {capitalizeFirstLetter(selectedFrequency)}
                </ThemedText>
              </Pressable>
            </Link>
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
            />
          </ThemedView>
          <Padder />
          {subCategory ? (
            <>
              <ThemedText
                style={{
                  textAlign: 'center',
                  letterSpacing: 3,
                  ...TYPO.small,
                }}
              >
                NEXT ENTRY PREVIEW
              </ThemedText>
              <Padder />
              <List>
                <ListItem
                  lastItem
                  title={subCategory.name}
                  description={nextEntry.format('HH:mm - ddd D MMM')}
                  category={subCategory.category}
                  // description={entry.categories.name}
                  right={toMoney(+amount * 100)}
                />
              </List>
            </>
          ) : null}
        </>
      ) : null}
    </ThemedView>
  )
}
