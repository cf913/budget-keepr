import { PADDING, TYPO } from '@/constants/Styles'
import { toMoney } from '@/utils/helpers'
import DateTimePicker from '@react-native-community/datetimepicker'
import dayjs from 'dayjs'
import { useState } from 'react'
import ThemedCheckbox from './Inputs/ThemedCheckbox'
import Padder from './Layout/Padder'
import List from './Lists/List'
import ListItem from './Lists/ListItem'
import { SubCategory } from './RecentEntries'
import { ThemedText } from './ThemedText'
import { ThemedView } from './ThemedView'

export type Frequency = 'daily' | 'weekly' | 'monthly' | 'yearly'

export default function RecurringInputs({
  isRecurring,
  setRecurring,
  subCategory,
  amount,
  frequency,
  setFrequency,
}: {
  isRecurring: boolean
  setRecurring: (v: boolean) => void
  subCategory: null | SubCategory
  amount: string
  frequency: Frequency
  setFrequency: (v: Frequency) => void
}) {
  const [date, setDate] = useState<Date>(new Date())

  const onChange = (event: any, selectedDate?: Date) => {
    if (!selectedDate) return
    setDate(selectedDate)
  }

  // TODO: frequency picker
  // TODO: calculate next entry for preview

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
          <ThemedView style={{ flexDirection: 'row', alignItems: 'center' }}>
            <ThemedText>Frequency:</ThemedText>
          </ThemedView>
          <Padder />
          <ThemedView style={{ flexDirection: 'row', alignItems: 'center' }}>
            <ThemedText>Start Date:</ThemedText>
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
                  description={dayjs().format('HH:mm - ddd D MMM')}
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
