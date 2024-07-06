import Page from '@/components/Layout/Page'
import { ThemedText } from '@/components/ThemedText'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function NewCategory() {
  const insets = useSafeAreaInsets()

  return (
    <Page
      down
      title="Quick Add"
      withHeader
      style={{
        position: 'relative',
        paddingBottom: insets.bottom,
      }}
    >
      <ThemedText>New Category</ThemedText>
    </Page>
  )
}
