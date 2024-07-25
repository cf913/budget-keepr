import { Page, Content } from '@/components/Layout'
import { ThemedText } from '@/components/ThemedText'
import { useLocalSearchParams } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function EditRecurringScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const insets = useSafeAreaInsets()
  return (
    <Page
      down
      title="Edit Entry"
      withHeader
      style={{
        position: 'relative',
        paddingBottom: insets.bottom,
      }}
    >
      <Content style={{ zIndex: 2 }}>
        <ThemedText>Welcome to the edit entry screen</ThemedText>
        <ThemedText>{id}</ThemedText>
      </Content>
    </Page>
  )
}
