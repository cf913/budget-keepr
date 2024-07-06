import { ThemedButton } from '@/components/Buttons/ThemedButton'
import { ThemedButtonCompact } from '@/components/Buttons/ThemedButtonCompact'
import ThemedInput from '@/components/Inputs/ThemedInput'
import Content from '@/components/Layout/Content'
import Padder from '@/components/Layout/Padder'
import Page from '@/components/Layout/Page'
import Spacer from '@/components/Layout/Spacer'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { useTempStore } from '@/stores/tempStore'
import { capitalizeFirstLetter } from '@/utils/helpers'
import { router } from 'expo-router'
import { useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function NewCategory() {
  const { selectedCategory } = useTempStore()
  const insets = useSafeAreaInsets()

  const [name, setName] = useState<string>('')
  const [saving, setSaving] = useState(false)

  const onSelectParent = () => {
    return router.navigate('/(main)/select-category')
  }

  const handleSave = async () => {
    if (!name) return alert('Nice try! Looks like you forgot to add a name :)')
    // set loading on button
    setSaving(true)
    // insert query
    await new Promise(r => setTimeout(r, 1000))
    setSaving(false)
    return router.back()
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
            title={capitalizeFirstLetter(selectedCategory?.name || 'Select Category')}
            style={{ borderColor: selectedCategory?.color, borderWidth: 2 }}
          />
        </ThemedView>
        <Padder />

        <ThemedInput
          value={name}
          placeholder="Name"
          onChangeText={setName}
          onSubmitEditing={() => { }}
          returnKeyType="done"
        />
      </Content>
      <Spacer />
      <Content>
        <ThemedView style={{ alignItems: 'center' }}>
          <Padder />
          <ThemedButton onPress={handleSave} title="Save Sub Category" loading={saving} />
        </ThemedView>
      </Content>
    </Page>
  )
}
