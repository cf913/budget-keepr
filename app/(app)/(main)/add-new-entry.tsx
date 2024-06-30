import { AnalyticsQueryKeys } from '@/components/Analytics'
import { ThemedButton } from '@/components/Buttons/ThemedButton'
import CategorySuggestions from '@/components/CategorySuggestions'
import ThemedInput from '@/components/Inputs/ThemedInput'
import Content from '@/components/Layout/Content'
import Padder from '@/components/Layout/Padder'
import Page from '@/components/Layout/Page'
import Spacer from '@/components/Layout/Spacer'
import EntryPreview from '@/components/Preview/EntryPreview'
import PreviewDisclaimer from '@/components/Preview/PreviewDisclaimer'
import { SubCategory } from '@/components/RecentEntries'
import RecurringInputs from '@/components/RecurringInputs'
import { ThemedText } from '@/components/ThemedText'
import { AnimatedView, ThemedView } from '@/components/ThemedView'
import { createEntry } from '@/data/mutations'
import { createRecurring } from '@/data/recurring'
import { queryClient } from '@/lib/tanstack'
import { useLocalSettings } from '@/stores/localSettings'
import { useTempStore } from '@/stores/tempStore'
import { getDayJSFrequencyFromString, getSQLFriendlyMonth, getWeekNumber } from '@/utils/helpers'
import DateTimePicker from '@react-native-community/datetimepicker'
import { useMutation } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { router } from 'expo-router'
import React, { useRef, useState } from 'react'
import { Keyboard, TextInput } from 'react-native'
import {
  FadeInUp,
  FadeOutDown,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function AddNewEntry() {
  // hooks
  const subCategoryInput = useRef<TextInput>(null)
  const insets = useSafeAreaInsets()
  const translateValue = useSharedValue(48 + 8) // 48 is the height of the input and 8 is the padding
  const opacityValue = useSharedValue(1)

  // stores
  const { defaultBudget } = useLocalSettings()
  const { selectedFrequency } = useTempStore()

  // state
  const [date, setDate] = useState<Date>(new Date())
  const [suggestionsVisible, setSuggestionsVisible] = useState(false)
  const [saving, setSaving] = useState(false)
  const [amount, setAmount] = useState<string>('')
  const [subCategory, setSubCategory] = useState<SubCategory | null>(null)
  const [subCategorySearchText, setSubCategorySearchText] = useState<string>('')
  const [isRecurring, setRecurring] = useState<boolean>(false)

  // queries
  // 2
  const mutationRecurring = useMutation({
    mutationFn: createRecurring,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['entries', ...AnalyticsQueryKeys],
      })

      setSaving(false)
      return router.replace('/(main)')
    },
    onError: error => {
      console.log('error', error.message)
      alert('Oops. ' + error.message)
    },
  })

  // 1
  const mutationEntry = useMutation({
    mutationFn: createEntry,
    onSuccess: () => {
      // if recurring entry then create recurring
      if (isRecurring) {
        const [unit, frequencyString] =
          getDayJSFrequencyFromString(selectedFrequency)
        const nextDate = dayjs(date).add(unit, frequencyString)

        if (!subCategory)
          return alert(
            'Oops... this should not have happened. Please select a category.',
          )

        mutationRecurring.mutate({
          budget_id: defaultBudget?.id!,
          start_at: date.toISOString(),
          next_at: nextDate.toISOString(),
          sub_category_id: subCategory.id,
          category_id: subCategory.category?.id,
          amount: Math.round(+amount * 100),
          frequency: selectedFrequency,
          active: true,
        })
      } else {
        // carry on with normal entry
        queryClient.invalidateQueries({
          queryKey: ['entries', ...AnalyticsQueryKeys],
        })
        setSaving(false)
        return router.replace('/(main)')
      }
    },
    onError: error => {
      console.log('error', error.message)
      alert('Oops. ' + error.message)
    },
  })

  const handleSave = async () => {
    if (!amount)
      return alert('Nice try! Looks like you forgot to add an amount :)')
    if (!subCategory) return alert('Oops... please select a category.')
    // set loading on button
    setSaving(true)
    // insert query

    mutationEntry.mutate({
      amount: Math.round(+amount * 100),
      created_at: date.toISOString(),
      sub_category_id: subCategory.id,
      category_id: subCategory.category?.id,
      budget_id: defaultBudget?.id,
      year: date.getFullYear(),
      month: getSQLFriendlyMonth(date),
      week: getWeekNumber(date),
      day: date.getDay(),
    })
  }

  const onSelect = (sub_cat: SubCategory) => {
    setSubCategorySearchText(sub_cat.name)
    setSubCategory(sub_cat)
    Keyboard.dismiss()
    subCategoryInput.current?.blur()
  }

  const animatedStyles = useAnimatedStyle(() => ({
    height: translateValue.value,
    opacity: opacityValue.value,
  }))


  const onChange = (_event: any, selectedDate?: Date) => {
    if (!selectedDate) return
    setDate(selectedDate)
  }

  return (
    <Page
      down
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
            translateValue.value = withTiming(0, { duration: 300 })
            setSuggestionsVisible(true)
          }}
          onInputBlur={() => {
            opacityValue.value = withTiming(1, { duration: 300 })
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
        <ThemedView
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <ThemedText>Date</ThemedText>
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode={'date'}
            is24Hour={true}
            onChange={onChange}
            key={date.toISOString()}
          />
        </ThemedView>
        <Padder />
        <RecurringInputs
          isRecurring={isRecurring}
          setRecurring={setRecurring}
          subCategory={subCategory}
          amount={amount}
          date={date}
          setDate={setDate}
        />
        <Padder />
        {!isRecurring && subCategory ? (
          <AnimatedView entering={FadeInUp} exiting={FadeOutDown.duration(200)}>
            <EntryPreview subCategory={subCategory} amount={amount} description={dayjs(date).format('HH:mm - ddd D MMM')} />
            <Padder h={0.5} />
            <PreviewDisclaimer />
          </AnimatedView>
        ) : null}
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
