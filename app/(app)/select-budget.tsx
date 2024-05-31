import {ThemedText} from '@/components/ThemedText'
import {ThemedView} from '@/components/ThemedView'
import {useLocalSettings} from '@/stores/localSettings'
import {router} from 'expo-router'
import {Pressable} from 'react-native'

export default function SelectBudget() {
  const {setDefaultBudgetId} = useLocalSettings()

  const onSelectBudget = async (id?: string) => {
    await setDefaultBudgetId(id)
    if (id) {
      router.replace('/(tabs)')
    }
  }

  return (
    <ThemedView>
      <ThemedText>TODO: Select Budget Screen</ThemedText>
      <Pressable onPress={() => onSelectBudget('food')}>
        <ThemedText>Food</ThemedText>
      </Pressable>
      <Pressable onPress={() => onSelectBudget('bills')}>
        <ThemedText>Bills</ThemedText>
      </Pressable>
      <Pressable onPress={() => onSelectBudget()}>
        <ThemedText>Null</ThemedText>
      </Pressable>
    </ThemedView>
  )
}
