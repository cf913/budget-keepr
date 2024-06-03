import {
  StyleSheet,
  Modal,
  Pressable,
  KeyboardAvoidingView,
  TextInput,
} from 'react-native'
import {ThemedView} from '@/components/ThemedView'
import {ReactNode, useRef, useState} from 'react'
import {ThemedText} from '@/components/ThemedText'
import Page from '@/components/Layout/Page'
import ThemedInput from '@/components/Inputs/ThemedInput'
import {ThemedButton} from '@/components/Buttons/ThemedButton'
import {Divider} from '@/components/Divider'
import Content from '@/components/Layout/Content'
import Padder from '@/components/Layout/Padder'
import {router} from 'expo-router'
import {Category, SubCategory} from '@/components/RecentEntries'
import Spacer from '@/components/Layout/Spacer'
import {HEIGHT, PADDING} from '@/constants/Styles'

export default function AddNewEntry({
  isVisible,
  children,
  onClose,
}: {
  isVisible: boolean
  children: ReactNode
  onClose: () => void
}) {
  const [amount, setAmount] = useState<string>('')
  // const [category, setCategory] = useState<Category | null>(null)
  const [subCategory, setSubCategory] = useState<string>('')
  const subCategoryInput = useRef<TextInput>(null)

  const handleSave = () => {
    alert('TODO: save new entry')
  }
  const handleBack = () => {
    router.back()
  }

  return (
    <Page
      back
      title="Add Entry"
      withHeader
      style={{
        position: 'relative',
      }}
    >
      {/* <KeyboardAvoidingView
        behavior="padding"
        style={{flex: 1}}
        keyboardVerticalOffset={HEIGHT.item + PADDING}
      > */}
      <Content>
        {/* AMOUNT */}
        <ThemedInput
          value={amount}
          placeholder="Amount"
          onChangeText={setAmount}
          keyboardType="decimal-pad"
          autoFocus
          returnKeyType="done"
          onSubmitEditing={() => subCategoryInput?.current?.focus()}
          blurOnSubmit={false}
        />
        {/* CATEGORY */}
        <ThemedInput
          ref={subCategoryInput}
          value={subCategory}
          placeholder="Name (Coles, Maccas)"
          onChangeText={setSubCategory}
          returnKeyType="search"
        />
        {/* SUB_CATEGORY */}
        {/* <ThemedInput
          value={name}
          placeholder="Category"
          onChangeText={(value: any) => {
            setName(value)
          }}
        /> */}
      </Content>
      {/* // FLOATING BUTTON */}
      <Spacer />
      <Content>
        <ThemedView style={{alignItems: 'center'}}>
          <Padder />
          <ThemedButton onPress={handleSave} title="Save" />
        </ThemedView>
      </Content>
      {/* </KeyboardAvoidingView> */}
    </Page>
  )
}

const styles = StyleSheet.create({
  title: {
    color: '#fff',
    fontSize: 16,
  },
})
