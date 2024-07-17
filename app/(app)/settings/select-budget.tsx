import { Page } from '@/components/Layout'
import SelectBudget from '@/components/Selects/SelectBudget'
import { router } from 'expo-router'

export default function SelectBudgetScreen() {
  return (
    <Page title="Select Budget" back>
      <SelectBudget callback={router.back} />
    </Page>
  )
}
