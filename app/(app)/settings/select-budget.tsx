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

  useEffect(() => {
    const load = async () => {
      const budgets = await getBudgets()
      setBudgets(budgets)
    }

    load()
  }, [])

  const onSelectBudget = async (budget: Budget) => {
    await setDefaultBudget(budget)
    router.back()
    // if (id) router.replace('/(tabs)')
  }

  return (
    <Page withHeader>
      <ThemedText>TODO: Select Budget Screen</ThemedText>
      {budgets.map((budget: Budget) => {
        return (
          <Pressable key={budget.id} onPress={() => onSelectBudget(budget)}>
            <ThemedText>{budget.name}</ThemedText>
          </Pressable>
        )
      })}
    </Page>
  )
}
