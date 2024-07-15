import { ThemedButton } from '@/components/Buttons/ThemedButton'
import { ThemedButtonCompact } from '@/components/Buttons/ThemedButtonCompact'
import ThemedInput from '@/components/Inputs/ThemedInput'
import Content from '@/components/Layout/Content'
import Padder from '@/components/Layout/Padder'
import Page from '@/components/Layout/Page'
import Spacer from '@/components/Layout/Spacer'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { createSubCategory } from '@/data/sub_categories'
import { useLocalSettings } from '@/stores/localSettings'
import { useTempStore } from '@/stores/tempStore'
import { capitalizeFirstLetter } from '@/utils/helpers'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { router } from 'expo-router'
import { useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function NewCategory() {
  const { selectedCategory } = useTempStore()
  const { defaultBudget } = useLocalSettings()
  const insets = useSafeAreaInsets()
  const queryClient = useQueryClient()

  const [name, setName] = useState<string>('')
  const [saving, setSaving] = useState(false)

  const onSelectParent = () => {
    return router.navigate('/(main)/select-category')
  }

  const mutation = useMutation({
    mutationFn: createSubCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['sub_categories', defaultBudget?.id],
      })
      router.back()
    },
    onError: error => {
      // throw new Error(error.message)
      alert('Oops.. ' + error.message)
    },
    onSettled: () => {
      setSaving(false)
    },
  })

  const handleSave = async () => {
    if (!name) return alert('Nice try! Looks like you forgot to add a name :)')
    if (!selectedCategory?.id) return alert('Select a parent category')
    if (!defaultBudget) return alert('Whoops, no default budget found')
    setSaving(true)

    mutation.mutate({
      name,
      parent_id: selectedCategory.id,
      budget_id: defaultBudget.id,
    })
    // set loading on button
    // insert query
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
            title={capitalizeFirstLetter(
              selectedCategory?.name || 'Select Category',
            )}
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
          <ThemedButton
            onPress={handleSave}
            title="Save Sub Category"
            loading={saving}
          />
        </ThemedView>
      </Content>
    </Page>
  )
}
