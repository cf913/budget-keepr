import { ThemedButtonCompact } from '@/components/Buttons/ThemedButtonCompact'
import Content from '@/components/Layout/Content'
import Page from '@/components/Layout/Page'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { useTempStore } from '@/stores/tempStore'
import { capitalizeFirstLetter } from '@/utils/helpers'
import { router } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function NewCategory() {
  const { selectedCategory } = useTempStore()
  const insets = useSafeAreaInsets()

  const onSelectParent = () => {
    return router.navigate('/(main)/new-category')
  }

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
      <Content>
        <ThemedView
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <ThemedText>Category</ThemedText>
          <ThemedButtonCompact
            onPress={onSelectParent}
            title={capitalizeFirstLetter(selectedCategory?.name)}
          />
        </ThemedView>
      </Content>
    </Page>
  )
}
