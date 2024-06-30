import Analytics from '@/components/Analytics'
import { ThemedButton } from '@/components/Buttons/ThemedButton'
import Content from '@/components/Layout/Content'
import Padder from '@/components/Layout/Padder'
import Page from '@/components/Layout/Page'
import RecentEntries from '@/components/RecentEntries'
import AllTimeAnalytics from '@/components/Screens/AllTimeAnalytics'
import { ThemedView } from '@/components/ThemedView'
import { PADDING } from '@/constants/Styles'
import { useThemeColor } from '@/hooks/useThemeColor'
import { useLocalSettings } from '@/stores/localSettings'
import { Feather } from '@expo/vector-icons'
import { Redirect, router } from 'expo-router'
import React, { useState } from 'react'
import { StyleSheet } from 'react-native'
import PagerView from 'react-native-pager-view'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function HomeScreen() {
  const { defaultBudget } = useLocalSettings()
  const insets = useSafeAreaInsets()

  const [counter, setCounter] = useState(0)
  const textColor = useThemeColor({}, 'text')

  if (!defaultBudget) return <Redirect href="select-budget-onboarding" />

  const onRefresh = () => {
    setCounter(prev => prev + 1)
  }

  return (
    <ThemedView style={styles.container}>
      <PagerView style={styles.container} initialPage={1}>
        <ThemedView style={styles.page} key="0">
          <AllTimeAnalytics />
        </ThemedView>
        <ThemedView style={styles.page} key="1">
          <Page
            scroll
            title={defaultBudget.name}
            refreshing={false}
            onRefresh={onRefresh}
            withSettings
            footer={
              <ThemedView
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  backgroundColor: 'transparent',
                }}
              >
                <ThemedButton
                  round
                  icon={<Feather name="list" size={24} color={textColor} />}
                  onPress={() => router.navigate('/settings/select-budget')}
                  title="BUDGET"
                  style={{ zIndex: 99 }}
                ></ThemedButton>
                <ThemedButton
                  round
                  onPress={() => router.navigate('add-new-entry')}
                  title="ADD NEW ENTRY"
                  style={{ zIndex: 99 }}
                ></ThemedButton>
              </ThemedView>
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
              <Padder
                style={{ height: insets.bottom ? insets.bottom : PADDING }}
              />
            </Content>
          </Page>
        </ThemedView>
      </PagerView>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  page: {
    flex: 1,
  },
})

