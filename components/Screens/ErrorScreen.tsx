import { PADDING } from '@/constants/Styles'
import { ThemedView } from '../ThemedView'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import ErrorContainer from '../ErrorContainer'
import { Page, Content, Padder } from '../Layout'

interface ErrorScreenProps {
  error: string
  onRetry?: () => void
}

export default function ErrorScreen({ error, onRetry }: ErrorScreenProps) {
  const insets = useSafeAreaInsets()

  return (
    <Page scroll title="Error" refreshing={false} onRefresh={onRetry} back>
      <Content style={{ flex: 1 }}>
        <ThemedView
          style={{
            flexGrow: 1,
            width: '100%',
            backgroundColor: 'transparent',
            height: 0,
          }}
        >
          <ErrorContainer error={error} onRetry={onRetry} />
        </ThemedView>
        <Padder />
        <Padder style={{ height: insets.bottom ? insets.bottom : PADDING }} />
      </Content>
    </Page>
  )
}
