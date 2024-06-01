import Page from '@/components/Layout/Page'
import {ThemedText} from '@/components/ThemedText'
import {getBudgets} from '@/data/queries'
import {Budget, useLocalSettings} from '@/stores/localSettings'
import {router} from 'expo-router'
import {useEffect, useState} from 'react'
import {Pressable} from 'react-native'

export default function SelectBudget() {
  const {setDefaultBudget} = useLocalSettings()

  const [budgets, setBudgets] = useState<any>([])
  const {defaultBudget} = useLocalSettings()

  useEffect(() => {
    const load = async () => {
      const budgets = await getBudgets()
      setBudgets(budgets)
    }

    load()
  }, [])

  const onSelectBudget = async (budget: Budget) => {
    await setDefaultBudget(budget)
    if (budget) router.replace('/(main)')
  }

  return (
    <Page withHeader>
      {budgets.map(budget => {
        return (
          <Pressable key={budget.id} onPress={() => onSelectBudget(budget)}>
            <ThemedText>{budget.name}</ThemedText>
          </Pressable>
        )
      })}
    </Page>
  )
}
