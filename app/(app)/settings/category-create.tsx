import { ThemedButton } from '@/components/Buttons/ThemedButton'
import ThemedInput from '@/components/Inputs/ThemedInput'
import Content from '@/components/Layout/Content'
import Padder from '@/components/Layout/Padder'
import Page from '@/components/Layout/Page'
import Spacer from '@/components/Layout/Spacer'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { HEIGHT, PADDING } from '@/constants/Styles'
import { createCategory } from '@/data/categories'
import { useThemeColor } from '@/hooks/useThemeColor'
import { useLocalSettings } from '@/stores/localSettings'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { router } from 'expo-router'
import { useState } from 'react'
import { KeyboardAvoidingView, Modal, Pressable } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import ColorPicker, {
  HueSlider,
  Panel1,
  Preview,
  Swatches,
} from 'reanimated-color-picker'
export default function CategoryCreate() {
  const { defaultBudget } = useLocalSettings()
  const insets = useSafeAreaInsets()
  const [name, setName] = useState('')
  const [showModal, setShowModal] = useState(false)
  const queryClient = useQueryClient()

  const [color, setColor] = useState('#000000')
  const [tempColor, setTempColor] = useState(color)

  const midColor = useThemeColor({}, 'mid')
  const bgColor = useThemeColor({}, 'bg')

  // Note: 👇 This can be a `worklet` function.
  const onSelectColor = ({ hex }: { hex: string }) => {
    // do something with the selected color.
    setTempColor(hex)
  }

  const mutation = useMutation({
    mutationFn: createCategory,
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
    mutation.mutate({ name, budget_id: defaultBudget.id, color })
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
      title="New Category"
      withHeader
      style={{
        position: 'relative',
        paddingBottom: insets.bottom,
      }}
    >
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
            autoFocus
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
