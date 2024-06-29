import { Redirect, router } from 'expo-router'
import { useLocalSettings } from '@/stores/localSettings'
import Page from '@/components/Layout/Page'
import Content from '@/components/Layout/Content'
import RecentEntries from '@/components/RecentEntries'
import Padder from '@/components/Layout/Padder'
import React, { useState } from 'react'
import { ThemedButton } from '@/components/Buttons/ThemedButton'
import Analytics from '@/components/Analytics'
import { Divider } from '@/components/Divider'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { ThemedView } from '@/components/ThemedView'
import { PADDING } from '@/constants/Styles'

export default function HomeScreen() {
  const { defaultBudget } = useLocalSettings()
  const insets = useSafeAreaInsets()
  const [counter, setCounter] = useState(0)

  if (!defaultBudget) return <Redirect href="select-budget-onboarding" />

  const onRefresh = () => {
    setCounter(prev => prev + 1)
  }

  return (
    <Page
      scroll
      title={defaultBudget.name}
      withSettings
      refreshing={false}
      onRefresh={onRefresh}
      footer={
        <ThemedButton
          round
          onPress={() => router.navigate('add-new-entry')}
          title="ADD NEW ENTRY"
          style={{ zIndex: 99 }}
        ></ThemedButton>
      }
    >
      <Content style={{ flex: 1 }}>
        {/* ANALYTICS */}
        <Analytics {...{ counter }} />
        <Padder h={2 / 3} />
        {/* /////// RECENT ENTRIES ///////// */}
        <ThemedView
          style={{
            flexGrow: 1,
            width: '100%',
            backgroundColor: 'transparent',
            height: 0, // INVESTIGATE WHY THIS IS REQUIRED
          }}
        >
          <RecentEntries {...{ counter, setCounter }} />
        </ThemedView>
        <Padder />
        <Padder style={{ height: insets.bottom ? insets.bottom : PADDING }} />
      </Content>
    </Page>
  )
}
