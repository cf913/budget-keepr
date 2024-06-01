import {Image, StyleSheet, Platform, Pressable} from 'react-native'

import {ThemedText} from '@/components/ThemedText'
import {Link, Redirect, router} from 'expo-router'
import {useLocalSettings} from '@/stores/localSettings'
import Page from '@/components/Layout/Page'
import Content from '@/components/Layout/Content'
import RecentEntries from '@/components/RecentEntries'
import Padder from '@/components/Layout/Padder'
import {useState} from 'react'
import {ThemedView} from '@/components/ThemedView'
import {ThemedButton} from '@/components/Buttons/ThemedButton'
import AddNewEntry from '@/components/Modal/AddNewEntry'

export default function HomeScreen() {
  const {defaultBudget} = useLocalSettings()
  const [refreshing, setRefreshing] = useState(false)
  const [counter, setCounter] = useState(0)
  const [isModalVisible, setIsModalVisible] = useState(false)

  if (!defaultBudget) return <Redirect href="select-budget-onboarding" />

  const onRefresh = () => {
    setCounter(prev => prev + 1)
  }

  return (
    <Page
      title={defaultBudget.name}
      withSettings
      refreshing={refreshing}
      onRefresh={onRefresh}
    >
      <Content>
        {/* /////// RECENT ENTRIES ///////// */}
        <RecentEntries {...{counter}} />

        <ThemedText
          style={{
            textDecorationLine: 'line-through',
            textDecorationStyle: 'solid',
          }}
        >
          - DONE: Header + link to Settings page
        </ThemedText>
        <ThemedText style={{}}>- WIP: Show last 5 entries</ThemedText>
        <ThemedText style={{}}>- TODO: Add New entries</ThemedText>
        <ThemedText style={{}}>- TODO: Delete entries</ThemedText>
        <ThemedText style={{}}>- TODO: Edit entries</ThemedText>
        <ThemedText style={{}}>- TODO: Create New Budget</ThemedText>
        <ThemedText style={{}}>- TODO: show total for this week</ThemedText>
        <ThemedText style={{}}>
          - TODO: show daily average spend on current_budget
        </ThemedText>
        <ThemedText style={{}}>
          - TODO: Show big fat ADD_ENTRY button down bottom
        </ThemedText>
      </Content>
      <Content>
        <ThemedView>
          <ThemedButton
            onPress={() => router.push('add-new-entry')}
            text="ADD NEW ENTRY"
          ></ThemedButton>
        </ThemedView>
      </Content>
      <AddNewEntry
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      >
        {/* A list of emoji component will go here */}
        <ThemedText>Modal content here</ThemedText>
      </AddNewEntry>
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
