import { Page, Content } from '@/components/Layout'
import List from '@/components/Lists/List'
import ListItem from '@/components/Lists/ListItem'
import { Frequency } from '@/components/RecurringInputs'
import { useTempStore } from '@/stores/tempStore'
import { capitalizeFirstLetter, isLastItem } from '@/utils/helpers'
import { router } from 'expo-router'

export default function SelectFrequency() {
  const { selectedFrequency, setSelectedFrequency } = useTempStore()
  const frequencies: Frequency[] = [
    'daily',
    'weekly',
    'fortnightly',
    'monthly',
    'quarterly',
    'biannually',
    'yearly',
  ]

  return (
    <Page title="Select Frequency" back withHeader>
      <Content>
        <List>
          {frequencies.map((frequency: Frequency, index: number) => {
            return (
              <ListItem
                onSelect={() => {
                  setSelectedFrequency(frequency)
                  router.back()
                }}
                key={frequency}
                title={capitalizeFirstLetter(frequency)}
                lastItem={isLastItem(frequencies, index)}
                checked={selectedFrequency === frequency}
              ></ListItem>
            )
          })}
        </List>
      </Content>
    </Page>
  )
}
