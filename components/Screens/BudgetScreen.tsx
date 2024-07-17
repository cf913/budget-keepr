import { PADDING } from '@/constants/Styles'
import Analytics from '../Analytics'
import HomePageFooter from '../Footers/HomePageFooter'
import RecentEntries from '../RecentEntries'
import { ThemedView } from '../ThemedView'
import { useLocalSettings } from '@/stores/localSettings'
import { useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import RecentRecurrings from '../RecentRecurrings'
import { Page, Content, Padder } from '../Layout'

export default function BudgetScreen() {
  const { defaultBudget } = useLocalSettings()
  const insets = useSafeAreaInsets()
  const [counter, setCounter] = useState(0)

  const onRefresh = () => {
    setCounter(prev => prev + 1)
  }

  return (
    <Page
      scroll
      title={defaultBudget?.name || 'Budget'}
      refreshing={false}
      onRefresh={onRefresh}
      footer={<HomePageFooter />}
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
            height: 0, // INVESTIGATE WHY THIS IS REQUIRED
          }}
        >
          <RecentEntries {...{ counter, setCounter }} />
          <Padder h={2 / 3} />
          <RecentRecurrings id={defaultBudget?.id} />
        </ThemedView>
        <Padder />
        <Padder style={{ height: insets.bottom ? insets.bottom : PADDING }} />
      </Content>
    </Page>
  )
}
