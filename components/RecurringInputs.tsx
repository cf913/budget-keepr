import { PADDING } from '@/constants/Styles'
import ThemedCheckbox from './Inputs/ThemedCheckbox'
import Padder from './Layout/Padder'
import { ThemedText } from './ThemedText'
import { ThemedView } from './ThemedView'

export default function RecurringInputs({
  isRecurring,
  setRecurring,
}: {
  isRecurring: boolean
  setRecurring: (v: boolean) => void
}) {
  return (
    // style={styles.checkbox}
    <ThemedView style={{ flexDirection: 'row' }}>
      <ThemedCheckbox
        checked={isRecurring}
        onChange={() => setRecurring(!isRecurring)}
      />
      <Padder style={{ width: PADDING / 2 }} />
      <ThemedText>Recurring?</ThemedText>
    </ThemedView>
  )
}
// style={{ margin: 8, backgroundColor: 'red', borderRadius: 20 }}
// label="Recurring?"
