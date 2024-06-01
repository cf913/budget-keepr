import {Image, StyleSheet, Platform, Pressable} from 'react-native'

import ParallaxScrollView from '@/components/ParallaxScrollView'
import {ThemedText} from '@/components/ThemedText'
import {ThemedView} from '@/components/ThemedView'
import {useEffect, useState} from 'react'
import {getBudgets} from '@/data/queries'
import {Link, Redirect} from 'expo-router'
import {useLocalSettings} from '@/stores/localSettings'
import Page from '@/components/Layout/Page'
import Content from '@/components/Layout/Content'

export default function HomeScreen() {
  const {defaultBudget} = useLocalSettings()

  if (!defaultBudget) return <Redirect href="select-budget-onboarding" />

  return (
    <Page title={defaultBudget.name} withSettings>
      <Content>
        <ThemedText style={{}}>- TODO: show total for this week</ThemedText>
        <ThemedText style={{}}>
          - TODO: show daily average spend on current_budget
        </ThemedText>
        <ThemedText style={{}}>- TODO: Show last 5 entries</ThemedText>
        <ThemedText style={{}}>
          - TODO: Show big fat ADD_ENTRY button down bottom
        </ThemedText>
      </Content>
    </Page>
  )
}

const styles = StyleSheet.create({
  titleContainer: {
    // flexDirection: 'row',
    // alignItems: 'center',
    // gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
})
