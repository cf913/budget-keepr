import { PADDING } from '@/constants/Styles'
import ThemedCheckbox from './Inputs/ThemedCheckbox'
import Padder from './Layout/Padder'
import { ThemedText } from './ThemedText'
import { ThemedView } from './ThemedView'
import DateTimePicker from '@react-native-community/datetimepicker'
import { useState } from 'react'
import { ThemedButton } from './Buttons/ThemedButton'

export default function RecurringInputs({
  isRecurring,
  setRecurring,
}: {
  isRecurring: boolean
  setRecurring: (v: boolean) => void
}) {
  const [date, setDate] = useState<Date>(new Date())
  const [mode, setMode] = useState<any>('date')
  const [show, setShow] = useState(false)

  const onChange = (event: any, selectedDate?: Date) => {
    if (!selectedDate) return
    setDate(selectedDate)
  }

  const showMode = (currentMode: string) => {
    setShow(true)
    setMode(currentMode)
  }

  const showDatePicker = () => {
    showMode('date')
  }

  return (
    // style={styles.checkbox}
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
      <ThemedView style={{ flexDirection: 'row', alignItems: 'center' }}>
        <ThemedText>Frequency:</ThemedText>
      </ThemedView>
      <Padder />
      <ThemedView style={{ flexDirection: 'row', alignItems: 'center' }}>
        <ThemedText>Start Date:</ThemedText>
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
          is24Hour={true}
          onChange={onChange}
        />
      </ThemedView>
    </ThemedView>
  )
}
// style={{ margin: 8, backgroundColor: 'red', borderRadius: 20 }}
// label="Recurring?"
