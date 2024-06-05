import {Image, StyleSheet, Platform, Pressable} from 'react-native'

import {ThemedText} from '@/components/ThemedText'
import {Link, Redirect, router} from 'expo-router'
import {useLocalSettings} from '@/stores/localSettings'
import Page from '@/components/Layout/Page'
import Content from '@/components/Layout/Content'
import RecentEntries from '@/components/RecentEntries'
import Padder from '@/components/Layout/Padder'
import React, {useState} from 'react'
import {ThemedView} from '@/components/ThemedView'
import {ThemedButton} from '@/components/Buttons/ThemedButton'
import AddNewEntry from '@/components/Modal/AddNewEntry'
import Spacer from '@/components/Layout/Spacer'
import Analytics from '@/components/Analytics'

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
      scroll
      title={defaultBudget.name}
      withSettings
      refreshing={refreshing}
      onRefresh={onRefresh}
      footer={
        <ThemedButton
          round
          onPress={() => router.navigate('add-new-entry')}
          title="ADD NEW ENTRY"
          style={{zIndex: 99}}
        ></ThemedButton>
      }
    >
      <Content>
        {/* ANALYTICS */}
        <Analytics {...{counter}} />
        <Padder />
        {/* /////// RECENT ENTRIES ///////// */}
        <RecentEntries {...{counter}} />

        <ThemedText style={{}}>- TODO: Delete entries</ThemedText>
        <ThemedText style={{}}>- TODO: Edit entries</ThemedText>
        <ThemedText style={{}}>- TODO: Create New Budget</ThemedText>
      </Content>
      {/* <Spacer /> */}
      {/* <Content floating>
        <ThemedView>
          <ThemedButton
            onPress={() => router.push('add-new-entry')}
            title="ADD NEW ENTRY"
          ></ThemedButton>
        </ThemedView>
      </Content> */}
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
