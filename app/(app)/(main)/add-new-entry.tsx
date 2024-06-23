import { ThemedButton } from '@/components/Buttons/ThemedButton'
import CategorySuggestions from '@/components/CategorySuggestions'
import { Divider } from '@/components/Divider'
import EntryPreview from '@/components/EntryPreview'
import ThemedInput from '@/components/Inputs/ThemedInput'
import Content from '@/components/Layout/Content'
import Padder from '@/components/Layout/Padder'
import Page from '@/components/Layout/Page'
import Spacer from '@/components/Layout/Spacer'
import { SubCategory } from '@/components/RecentEntries'
import RecurringInputs, { Frequency } from '@/components/RecurringInputs'
import { AnimatedView, ThemedView } from '@/components/ThemedView'
import { createEntry } from '@/data/mutations'
import { useLocalSettings } from '@/stores/localSettings'
import { getWeekNumber } from '@/utils/helpers'
import { router } from 'expo-router'
import React, { useRef, useState } from 'react'
import { Keyboard, TextInput } from 'react-native'
import {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function AddNewEntry() {
  const translateValue = useSharedValue(48 + 8) // 48 is the height of the input and 8 is the padding
  const opacityValue = useSharedValue(1)
  const { defaultBudget } = useLocalSettings()
  const insets = useSafeAreaInsets()
  const [suggestionsVisible, setSuggestionsVisible] = useState(false)
  const [saving, setSaving] = useState(false)
  const [amount, setAmount] = useState<string>('')
  const [subCategory, setSubCategory] = useState<SubCategory | null>(null)
  const [subCategorySearchText, setSubCategorySearchText] = useState<string>('')
  const [isRecurring, setRecurring] = useState<boolean>(false)
  const [frequency, setFrequency] = useState<Frequency>('daily')
  const subCategoryInput = useRef<TextInput>(null)

  const handleSave = async () => {
    if (!amount)
      return alert('Nice try! Looks like you forgot to add an amount :)')
    if (!subCategory) return alert('Oops... please select a category.')
    // set loading on button
    console.log('saving...')
    setSaving(true)
    // insert query
    console.log('setSaving')
    const now = new Date()
    const { error }: any = await createEntry({
      amount: Math.round(+amount * 100),
      sub_category_id: subCategory.id,
      category_id: subCategory.category?.id,
      budget_id: defaultBudget?.id,
      year: now.getFullYear(),
      month: now.getMonth(),
      week: getWeekNumber(now),
      day: now.getDay(),
    })

    console.log(getWeekNumber(new Date()))

    console.log('after createEntry')

    // if error reset loading and show error message
    if (error) {
      setSaving(false)
      alert(error.message)
    }
    // else navigate back to main screen
    setSaving(false)
    return router.replace('/(main)')
  }

  const onSelect = (sub_cat: SubCategory) => {
    setSubCategorySearchText(sub_cat.name)
    setSubCategory(sub_cat)
    console.log('the cat', sub_cat)
    Keyboard.dismiss()
    subCategoryInput.current?.blur()
  }

  const animatedStyles = useAnimatedStyle(() => ({
    height: translateValue.value,
    opacity: opacityValue.value,
  }))

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
      <Content style={{ zIndex: 2 }}>
        {/* AMOUNT */}
        <AnimatedView style={[animatedStyles]}>
          <ThemedInput
            value={amount}
            placeholder="Amount"
            onChangeText={setAmount}
            keyboardType="decimal-pad"
            autoFocus
            returnKeyType="done"
            onSubmitEditing={() =>
              subCategory ? null : subCategoryInput?.current?.focus()
            }
            blurOnSubmit={false}
          />
        </AnimatedView>

        {/* CATEGORY */}
        <ThemedInput
          ref={subCategoryInput}
          value={subCategorySearchText}
          placeholder="Name (Coles, Maccas)"
          onChangeText={setSubCategorySearchText}
          returnKeyType="search"
          onInputFocus={() => {
            opacityValue.value = withTiming(0, { duration: 200 })
            translateValue.value = withTiming(0, { duration: 500 })
            setSuggestionsVisible(true)
          }}
          onInputBlur={() => {
            opacityValue.value = withTiming(1, { duration: 500 })
            translateValue.value = withDelay(
              100,
              withTiming(48 + 8, { duration: 200 }),
            )
            setSuggestionsVisible(false)
          }}
        />

        <CategorySuggestions
          onSelect={onSelect}
          searchText={subCategorySearchText}
          visible={suggestionsVisible}
          onAddNew={() => {
            router.back()
            router.navigate('/settings/categories')
          }}
        />
        <Padder />
        <RecurringInputs
          isRecurring={isRecurring}
          setRecurring={setRecurring}
          subCategory={subCategory}
          amount={amount}
        />
        <Padder />
        <Divider />
        <Padder />
        <EntryPreview subCategory={subCategory} amount={amount} />
        <Padder />
      </Content>
      {/* // FLOATING BUTTON */}
      <Spacer />
      <Content>
        <ThemedView style={{ alignItems: 'center' }}>
          <Padder />
          <ThemedButton onPress={handleSave} title="Save" loading={saving} />
        </ThemedView>
      </Content>
      {/* </>
      </TouchableWithoutFeedback> */}
      {/* </KeyboardAvoidingView> */}
    </Page>
  )
}
