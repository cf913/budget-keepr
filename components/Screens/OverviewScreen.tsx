import { PADDING } from '@/constants/Styles'
import { useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Analytics from '../Analytics'
import CardVersusAll from '../Cards/CardVersusAll'
import RecentRecurrings from '../RecentRecurrings'
import { Page, Content, Padder } from '../Layout'

export default function AllTimeAnalytics() {
  const insets = useSafeAreaInsets()
  const [counter, setCounter] = useState(0)

  const onRefresh = () => {
    setCounter(prev => prev + 1)
  }

  return (
    <Page scroll title={'Overview'} refreshing={false} onRefresh={onRefresh}>
      <Content style={{ flex: 1 }}>
        {/* ANALYTICS */}
        <Analytics {...{ counter }} />
        <Padder h={2 / 3} />
        <CardVersusAll counter={counter} />
        <Padder h={2 / 3} />
        <RecentRecurrings />
        <Padder />
        <Padder style={{ height: insets.bottom ? insets.bottom : PADDING }} />
      </Content>
    </Page>
  )
}
