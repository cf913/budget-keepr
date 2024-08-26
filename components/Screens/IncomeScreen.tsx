import { PADDING } from '@/constants/Styles'
import { useLocalSettings } from '@/stores/localSettings'
import React, { useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Analytics from '../Analytics'
import HomePageFooter from '../Footers/HomePageFooter'
import { Content, Padder, Page } from '../Layout'
import { ThemedView } from '../ThemedView'
import { ThemedText } from '../ThemedText'

export default function IncomeScreen() {
  const { defaultBudget } = useLocalSettings()
  const insets = useSafeAreaInsets()
  const [counter, setCounter] = useState(0)

  const onRefresh = () => {
    setCounter(prev => prev + 1)
  }

  return (
    <Page
      scroll
      title={'Income'}
      refreshing={false}
      onRefresh={onRefresh}
      withSettings
    >
      <Content style={{ flex: 1 }}>
        {/* ANALYTICS */}
        <Analytics {...{ counter, budget_id: defaultBudget?.id }} />
        <Padder h={2 / 3} />
        {/* /////// RECENT ENTRIES ///////// */}
        <ThemedView
          style={{
            flexGrow: 1,
            width: '100%',
            backgroundColor: 'transparent',
          }}
        >
          <ThemedText>Show Income entries</ThemedText>
        </ThemedView>
        <Padder />
        <Padder style={{ height: insets.bottom ? insets.bottom : PADDING }} />
      </Content>
    </Page>
  )
}
