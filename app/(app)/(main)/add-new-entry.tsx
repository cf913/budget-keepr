import {StyleSheet, TextInput, Keyboard} from 'react-native'
import {ThemedView} from '@/components/ThemedView'
import {ReactNode, useRef, useState} from 'react'
import {ThemedText} from '@/components/ThemedText'
import Page from '@/components/Layout/Page'
import ThemedInput from '@/components/Inputs/ThemedInput'
import {ThemedButton} from '@/components/Buttons/ThemedButton'
import {Divider} from '@/components/Divider'
import Content from '@/components/Layout/Content'
import Padder from '@/components/Layout/Padder'
import {Redirect, router} from 'expo-router'
import {Category, SubCategory} from '@/components/RecentEntries'
import Spacer from '@/components/Layout/Spacer'
import {useSafeAreaInsets} from 'react-native-safe-area-context'
import CategorySuggestions from '@/components/CategorySuggestions'
import {useDebouncedValue} from '@/hooks/useDebounce'
import List from '@/components/Lists/List'
import ListItem from '@/components/Lists/ListItem'
import dayjs from 'dayjs'
import {toMoney} from '@/utils/helpers'
import {useLocalSettings} from '@/stores/localSettings'
import {createEntry} from '@/data/mutations'

export default function AddNewEntry({}: {}) {
  const {defaultBudget} = useLocalSettings()
  const insets = useSafeAreaInsets()
  const [saving, setSaving] = useState(false)
  const [amount, setAmount] = useState<string>('')
  const [subCategory, setSubCategory] = useState<SubCategory | null>(null)
  const [subCategorySearchText, setSubCategorySearchText] = useState<string>('')
  const debouncedSubCategorySearchText = useDebouncedValue(
    subCategorySearchText,
    200,
  )
  const subCategoryInput = useRef<TextInput>(null)

  const handleSave = async () => {
    if (!subCategory) return
    // set loading on button
    setSaving(true)
    // insert query
    const {data, error}: any = await createEntry({
      amount: Math.round(+amount * 100),
      sub_category_id: subCategory.id,
      category_id: subCategory.categories?.id,
      budget_id: defaultBudget?.id,
    })

    // if error reset loading and show error message
    if (error) {
      setSaving(false)
      alert(error.message)
    }
    // else navigate back to main screen
    setSaving(false)
    return router.replace('/(main)')
  }
  const handleBack = () => {
    router.back()
  }

  const onSelect = (sub_cat: SubCategory) => {
    setSubCategorySearchText(sub_cat.name)
    setSubCategory(sub_cat)
    Keyboard.dismiss()
    subCategoryInput.current?.blur()
  }

  return (
    <Page
      back
      title="Add Entry"
      withHeader
      style={{
        position: 'relative',
        paddingBottom: insets.bottom,
      }}
    >
      {/* <KeyboardAvoidingView
        behavior="padding"
        style={{flex: 1}}
        keyboardVerticalOffset={HEIGHT.item + PADDING}
      > */}
      <Content style={{zIndex: 2}}>
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
          value={subCategorySearchText}
          placeholder="Name (Coles, Maccas)"
          onChangeText={setSubCategorySearchText}
          returnKeyType="search"
        />
        {subCategoryInput.current?.isFocused() ? (
          <CategorySuggestions
            onSelect={onSelect}
            searchText={debouncedSubCategorySearchText}
          />
        ) : null}
        <Padder />
        <Divider />
        <Padder />
        {subCategory ? (
          <>
            <ThemedText>Preview</ThemedText>
            <Padder h={0.5} />
            <List>
              <ListItem
                lastItem
                title={subCategory.name}
                description={dayjs().format('HH:mm - ddd D MMM')}
                category={subCategory.categories}
                // description={entry.categories.name}
                right={toMoney(+amount * 100)}
              />
            </List>
          </>
        ) : null}
      </Content>
      {/* // FLOATING BUTTON */}
      <Spacer />
      <Content>
        <ThemedView style={{alignItems: 'center'}}>
          <Padder />
          <ThemedButton onPress={handleSave} title="Save" loading={saving} />
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
