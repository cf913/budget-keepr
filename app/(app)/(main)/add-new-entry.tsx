import { Feather } from '@expo/vector-icons'
import DateTimePicker from '@react-native-community/datetimepicker'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { router } from 'expo-router'
import React, { useCallback, useRef, useState } from 'react'
import { Keyboard, Pressable, TextInput } from 'react-native'
import Animated, {
  FadeInUp,
  FadeOutDown,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { ThemedButton } from '@/components/Buttons/ThemedButton'
import CategorySuggestions from '@/components/CategorySuggestions'
import ThemedInput from '@/components/Inputs/ThemedInput'
import EntryPreview from '@/components/Preview/EntryPreview'
import PreviewDisclaimer from '@/components/Preview/PreviewDisclaimer'
import { SubCategory } from '@/components/RecentEntries'
import RecurringInputs from '@/components/RecurringInputs'
import { ThemedText } from '@/components/ThemedText'
import { AnimatedView, ThemedView } from '@/components/ThemedView'
import { createEntry } from '@/data/mutations'
import { createRecurring } from '@/data/recurring'
import { useColors } from '@/hooks/useColors'
import Toasty from '@/lib/Toasty'
import { useLocalSettings } from '@/stores/localSettings'
import { useTempStore } from '@/stores/tempStore'
import {
  getDayJSFrequencyFromString,
  getSQLFriendlyMonth,
  getWeekNumber,
} from '@/utils/helpers'
import dayjs from 'dayjs'
import { Page, Content, Padder, Spacer } from '@/components/Layout'

export default function AddNewEntry() {
  const subCategoryInput = useRef<TextInput>(null)
  const insets = useSafeAreaInsets()
  const translateValue = useSharedValue(56)
  const opacityValue = useSharedValue(1)
  const { textColor, bgColor2 } = useColors()
  const queryClient = useQueryClient()

  const { defaultBudget } = useLocalSettings()
  const { selectedFrequency } = useTempStore()

  const [date, setDate] = useState<Date>(new Date())
  const [suggestionsVisible, setSuggestionsVisible] = useState(false)
  const [saving, setSaving] = useState(false)
  const [amount, setAmount] = useState<string>('')
  const [subCategory, setSubCategory] = useState<SubCategory | null>(null)
  const [subCategorySearchText, setSubCategorySearchText] = useState<string>('')
  const [isRecurring, setRecurring] = useState<boolean>(false)

  const mutationRecurring = useMutation({
    mutationFn: createRecurring,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entries'] })
      queryClient.invalidateQueries({ queryKey: ['Analytics'] })
      queryClient.invalidateQueries({ queryKey: ['infinite_entries'] })
      setSaving(false)
      router.replace('/(main)')
    },
    onError: error => {
      console.error('Error creating recurring entry:', error)
      Toasty.error('Failed to create recurring entry')
    },
  })

  const mutationEntry = useMutation({
    mutationFn: createEntry,
    onSuccess: () => {
      if (isRecurring) {
        handleRecurringEntry()
      } else {
        handleNormalEntry()
      }
    },
    onError: error => {
      console.error('Error creating entry:', error)
      Toasty.error('Failed to create entry')
    },
  })

  const handleRecurringEntry = useCallback(() => {
    if (!subCategory) {
      Toasty.error('Please select a category')
      return
    }

    const [unit, frequencyString] =
      getDayJSFrequencyFromString(selectedFrequency)
    const nextDate = dayjs(date).add(unit, frequencyString)

    mutationRecurring.mutate({
      budget_id: defaultBudget?.id!,
      start_at: date.toISOString(),
      next_at: nextDate.toISOString(),
      sub_category_id: subCategory.id,
      category_id: subCategory.category?.id!,
      amount: Math.round(+amount * 100),
      frequency: selectedFrequency,
      active: true,
    })
  }, [
    subCategory,
    date,
    amount,
    selectedFrequency,
    defaultBudget,
    mutationRecurring,
  ])

  const handleNormalEntry = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['entries'] })
    queryClient.invalidateQueries({ queryKey: ['infinite_entries'] })
    // AnalyticsQueryKeys.forEach((qk: string) => {
    //   queryClient.invalidateQueries({ queryKey: [qk] })
    // })
    setSaving(false)
    Toasty.success('Entry saved!')
    router.replace('/(main)')
  }, [queryClient])

  const handleSave = useCallback(() => {
    if (!amount) {
      Toasty.error('Please enter an amount')
      return
    }
    if (!subCategory) {
      Toasty.error('Please select a category')
      return
    }
    setSaving(true)

    mutationEntry.mutate({
      amount: Math.round(+amount * 100),
      created_at: date.toISOString(),
      sub_category_id: subCategory.id,
      category_id: subCategory.category?.id!,
      budget_id: defaultBudget?.id!,
      year: date.getFullYear(),
      month: getSQLFriendlyMonth(date),
      week: getWeekNumber(date),
      day: date.getDay(),
    })
  }, [amount, subCategory, date, defaultBudget, mutationEntry])

  const onSelect = useCallback((sub_cat: SubCategory) => {
    setSubCategorySearchText(sub_cat.name)
    setSubCategory(sub_cat)
    Keyboard.dismiss()
    subCategoryInput.current?.blur()
  }, [])

  const animatedStyles = useAnimatedStyle(() => ({
    height: translateValue.value,
    opacity: opacityValue.value,
  }))

  const onChange = useCallback((_event: any, selectedDate?: Date) => {
    if (selectedDate) setDate(selectedDate)
  }, [])

  const goToNewCategory = useCallback(() => {
    router.navigate('/new-category')
  }, [])

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
        <AnimatedView style={[animatedStyles]}>
          <ThemedInput
            value={amount}
            placeholder="Amount"
            onChangeText={setAmount}
            keyboardType="decimal-pad"
            autoFocus
            returnKeyType="done"
            onSubmitEditing={() => {
              subCategory
                ? Keyboard.dismiss()
                : subCategoryInput?.current?.focus()
            }}
            blurOnSubmit={false}
          />
        </AnimatedView>

        <ThemedView style={{ flexDirection: 'row', alignItems: 'center' }}>
          <ThemedView style={{ flex: 1 }}>
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
                  withTiming(56, { duration: 200 }),
                )
                setSuggestionsVisible(false)
              }}
            />
          </ThemedView>
          <Padder w={0.5} />
          <Pressable onPress={goToNewCategory}>
            <ThemedView
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                height: 48,
                borderRadius: 8,
                paddingHorizontal: 16,
                marginBottom: 8,
                backgroundColor: bgColor2,
              }}
            >
              <Feather name="plus" size={24} color={textColor} />
            </ThemedView>
          </Pressable>
        </ThemedView>

        <CategorySuggestions
          onSelect={onSelect}
          searchText={subCategorySearchText}
          visible={suggestionsVisible}
          onAddNew={goToNewCategory}
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
        {!isRecurring && subCategory && (
          <Animated.View
            entering={FadeInUp}
            exiting={FadeOutDown.duration(200)}
          >
            <EntryPreview
              subCategory={subCategory}
              amount={amount}
              description={dayjs(date).format('HH:mm - ddd D MMM')}
            />
            <Padder h={0.5} />
            <PreviewDisclaimer />
          </Animated.View>
        )}
        <ThemedText>Attemp to create a merge conflict</ThemedText>
        <Padder />
      </Content>
      <Spacer />
      <Content>
        <ThemedView style={{ alignItems: 'center' }}>
          <Padder />
          <ThemedButton onPress={handleSave} title="Save" loading={saving} />
        </ThemedView>
      </Content>
    </Page>
  )
}
