import {ThemedButton} from '@/components/Buttons/ThemedButton'
import ThemedInput from '@/components/Inputs/ThemedInput'
import Content from '@/components/Layout/Content'
import Padder from '@/components/Layout/Padder'
import Page from '@/components/Layout/Page'
import Spacer from '@/components/Layout/Spacer'
import {ThemedView} from '@/components/ThemedView'
import {HEIGHT, PADDING} from '@/constants/Styles'
import {createCategory} from '@/data/categories'
import {queryClient} from '@/lib/tanstack'
import {useLocalSettings} from '@/stores/localSettings'
import {useMutation} from '@tanstack/react-query'
import {router} from 'expo-router'
import {useState} from 'react'
import {KeyboardAvoidingView} from 'react-native'
import {useSafeAreaInsets} from 'react-native-safe-area-context'

export default function CategoryCreate() {
  const {defaultBudget} = useLocalSettings()
  const insets = useSafeAreaInsets()
  const [name, setName] = useState('')

  const mutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['categories']})
      router.back()
    },
    onError: error => {
      console.log('error', error.message)
      alert('Oops. ' + error.message)
    },
  })

  const handleSave = async () => {
    if (!defaultBudget) {
      alert('No default budget set')
      return
    }
    mutation.mutate({name, budget_id: defaultBudget.id})
  }

  return (
    <Page
      back
      title="New Category"
      withHeader
      style={{
        position: 'relative',
        paddingBottom: insets.bottom,
      }}
    >
      <KeyboardAvoidingView
        behavior="padding"
        style={{flex: 1}}
        keyboardVerticalOffset={HEIGHT.item + PADDING}
      >
        <Content style={{zIndex: 2}}>
          <ThemedInput
            value={name}
            placeholder="Restaurant, Shop, ..."
            onChangeText={setName}
            autoFocus
          />
        </Content>
        <Spacer />
        <Content>
          <ThemedView style={{alignItems: 'center'}}>
            <Padder />
            <ThemedButton
              onPress={handleSave}
              title="Save"
              loading={mutation.isPending}
            />
          </ThemedView>
        </Content>
      </KeyboardAvoidingView>
    </Page>
  )
}
