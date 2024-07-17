import BudgetScreen from '@/components/Screens/BudgetScreen'
import Overview from '@/components/Screens/OverviewScreen'
import { ThemedView } from '@/components/ThemedView'
import { useLocalSettings } from '@/stores/localSettings'
import { Redirect } from 'expo-router'
import React from 'react'
import { StyleSheet } from 'react-native'
import PagerView from 'react-native-pager-view'
// import Settings from '../settings'

export default function HomeScreen() {
  const { defaultBudget } = useLocalSettings()
  if (!defaultBudget) return <Redirect href="select-budget-onboarding" />

  // TODO: make pages lazy load
  return (
    <ThemedView style={styles.container}>
      <PagerView style={styles.container} initialPage={1}>
        <ThemedView style={styles.page} key="0">
          <Overview />
        </ThemedView>
        <ThemedView style={styles.page} key="1">
          <BudgetScreen />
        </ThemedView>
        {/* <ThemedView style={styles.page} key="2"> */}
        {/*   <Settings /> */}
        {/* </ThemedView> */}
      </PagerView>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  page: {
    flex: 1,
  },
})
