import { PADDING } from '@/constants/Styles'
import { Feather } from '@expo/vector-icons'
import { router } from 'expo-router'
import Analytics from '../Analytics'
import { ThemedButton } from '../Buttons/ThemedButton'
import Content from '../Layout/Content'
import Padder from '../Layout/Padder'
import Page from '../Layout/Page'
import RecentEntries from '../RecentEntries'
import { ThemedView } from '../ThemedView'
import { useThemeColor } from '@/hooks/useThemeColor'
import { useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function AllTimeAnalytics() {
  const insets = useSafeAreaInsets()
  const [counter, setCounter] = useState(0)

  const onRefresh = () => {
    setCounter(prev => prev + 1)
  }

  return (
    <Page
      scroll
      title={'All Time'}
      refreshing={false}
      onRefresh={onRefresh}
      withSettings
    >
      <Content style={{ flex: 1 }}>
        {/* ANALYTICS */}
        <Analytics {...{ counter }} />
        <Padder h={2 / 3} />
        <Padder style={{ height: insets.bottom ? insets.bottom : PADDING }} />
      </Content>
    </Page>
  )
}
