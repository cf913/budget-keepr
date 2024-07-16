import { ThemedButton } from '@/components/Buttons/ThemedButton'
import ThemedInput from '@/components/Inputs/ThemedInput'
import Content from '@/components/Layout/Content'
import Padder from '@/components/Layout/Padder'
import Page from '@/components/Layout/Page'
import Spacer from '@/components/Layout/Spacer'
import { Loader } from '@/components/Loader'
import { Category } from '@/components/RecentEntries'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { HEIGHT, PADDING } from '@/constants/Styles'
import { getCategory, updateCategory } from '@/data/categories'
import { useThemeColor } from '@/hooks/useThemeColor'
import { useLocalSettings } from '@/stores/localSettings'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { router, useLocalSearchParams } from 'expo-router'
import { useState } from 'react'
import { KeyboardAvoidingView, Modal, Pressable } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import ColorPicker, {
  HueSlider,
  Panel1,
  Preview,
  Swatches,
} from 'reanimated-color-picker'

export default function Container() {
  const { id } = useLocalSearchParams<{ id: string }>()

  const dataCategory = useQuery({
    queryKey: ['category', id],
    queryFn: () => getCategory(id),
  })

  return (
    <CategoryEdit
      category={dataCategory.data}
      isLoading={dataCategory.isLoading}
    />
  )
}

function CategoryEdit({
  category,
  isLoading,
}: {
  category: Category | undefined
  isLoading: boolean
}) {
  const { defaultBudget } = useLocalSettings()
  const insets = useSafeAreaInsets()
  const [name, setName] = useState<string>(category?.name ?? '')
  const [color, setColor] = useState(category?.color ?? '#000000')
  const queryClient = useQueryClient()
  const [showModal, setShowModal] = useState(false)

  const [tempColor, setTempColor] = useState(color)

  const midColor = useThemeColor({}, 'mid')
  const bgColor = useThemeColor({}, 'bg')

  // Note: 👇 This can be a `worklet` function.
  const onSelectColor = ({ hex }: { hex: string }) => {
    // do something with the selected color.
    setTempColor(hex)
  }

  const mutation = useMutation({
    mutationFn: updateCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
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

    if (!category) {
      alert('Category not found')
      return
    }
    mutation.mutate({ name, color, id: category.id })
  }

  const onSaveColor = () => {
    setColor(tempColor)
    setShowModal(false)
  }

  const onCancelColor = () => {
    setTempColor(color)
    setShowModal(false)
  }

  return (
    <Page
      back
      title="Edit Category"
      style={{
        position: 'relative',
        paddingBottom: insets.bottom,
      }}
      withHeader
    >
      {isLoading && <Loader />}
      {!isLoading ? (
        <KeyboardAvoidingView
          behavior="padding"
          style={{ flex: 1 }}
          keyboardVerticalOffset={HEIGHT.item + PADDING}
        >
          <Content style={{ zIndex: 2 }}>
            <ThemedInput
              value={name}
              placeholder="Restaurant, Shop, ..."
              onChangeText={setName}
            />
            <Padder h={0.5} />
            <ThemedView
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <ThemedText>Color</ThemedText>
              <Pressable onPress={() => setShowModal(true)}>
                <ThemedView
                  style={{
                    borderWidth: 1,
                    borderColor: midColor,
                    height: 48,
                    width: HEIGHT.item * 2,
                    borderRadius: 8,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: color,
                  }}
                ></ThemedView>
              </Pressable>
            </ThemedView>
          </Content>
          <Spacer />
          <Content>
            <ThemedView style={{ alignItems: 'center' }}>
              <Padder />
              <ThemedButton
                onPress={handleSave}
                title="Save"
                loading={mutation.isPending}
              />
            </ThemedView>
          </Content>
        </KeyboardAvoidingView>
      ) : null}
      <Modal visible={showModal} animationType="slide">
        <Page>
          <Content>
            <ColorPicker value={color} onComplete={onSelectColor}>
              <Preview />
              <Padder h={0.5} />
              <Panel1 />
              <Padder h={0.5} />
              <HueSlider />
              <Padder h={0.5} />
              <Swatches />
            </ColorPicker>
            <ThemedButton title="Ok" onPress={onSaveColor} />
            <Padder h={0.5} />
            <ThemedButton
              style={{ backgroundColor: bgColor }}
              title="Cancel"
              onPress={onCancelColor}
            />
          </Content>
        </Page>
      </Modal>
    </Page>
  )
}
