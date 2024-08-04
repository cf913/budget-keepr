import { Feather } from '@expo/vector-icons'
import DateTimePicker from '@react-native-community/datetimepicker'
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

import CategorySuggestions from '@/components/CategorySuggestions'
import ThemedInput from '@/components/Inputs/ThemedInput'
import { Content, Padder } from '@/components/Layout'
import EntryPreview from '@/components/Preview/EntryPreview'
import PreviewDisclaimer from '@/components/Preview/PreviewDisclaimer'
import { SubCategory } from '@/components/RecentEntries'
import RecurringInputs from '@/components/RecurringInputs'
import { ThemedText } from '@/components/ThemedText'
import { AnimatedView, ThemedView } from '@/components/ThemedView'
import { useColors } from '@/hooks/useColors'
import dayjs from 'dayjs'
import { router } from 'expo-router'

type EntryFormProps = {
  amount: string
  setAmount: React.Dispatch<React.SetStateAction<string>>
  subCategory: SubCategory | null
  setSubCategory: React.Dispatch<React.SetStateAction<SubCategory | null>>
  date: Date
  setDate: React.Dispatch<React.SetStateAction<Date>>
  recurring?: boolean
  isRecurring: boolean
  setRecurring: React.Dispatch<React.SetStateAction<boolean>>
}

export default function EntryForm(props: EntryFormProps) {
  const {
    amount,
    setAmount,
    subCategory,
    setSubCategory,
    date,
    setDate,
    recurring = false,
    isRecurring,
    setRecurring,
  } = props
  const subCategoryInput = useRef<TextInput>(null)
  const [subCategorySearchText, setSubCategorySearchText] = useState<string>(
    subCategory?.name || '',
  )
  const [suggestionsVisible, setSuggestionsVisible] = useState(false)

  const translateValue = useSharedValue(56)
  const opacityValue = useSharedValue(1)
  const { textColor, bgColor2 } = useColors()

  const animatedStyles = useAnimatedStyle(() => ({
    height: translateValue.value,
    opacity: opacityValue.value,
  }))

  const goToNewCategory = useCallback(() => {
    router.navigate('/new-category')
  }, [])

  const onChangeDate = useCallback((_event: any, selectedDate?: Date) => {
    if (selectedDate) setDate(selectedDate)
  }, [])

  const onSelectCategory = useCallback((sub_cat: SubCategory) => {
    setSubCategorySearchText(sub_cat.name)
    setSubCategory(sub_cat)
    Keyboard.dismiss()
    subCategoryInput.current?.blur()
  }, [])

  return (
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
            editable={!recurring}
            ref={subCategoryInput}
            value={subCategorySearchText}
            placeholder="Name (Coles, Maccas)"
            onChangeText={setSubCategorySearchText}
            style={recurring ? { opacity: 0.4 } : {}}
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
        onSelect={onSelectCategory}
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
        <ThemedText>{recurring ? 'Next Date' : 'Date'}</ThemedText>
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={'date'}
          is24Hour={true}
          onChange={onChangeDate}
        />
      </ThemedView>
      <Padder />
      <RecurringInputs
        recurring={recurring}
        isRecurring={isRecurring}
        setRecurring={setRecurring}
        subCategory={subCategory}
        amount={amount}
        date={date}
        setDate={setDate}
      />
      <Padder />
      {!isRecurring && subCategory && (
        <Animated.View entering={FadeInUp} exiting={FadeOutDown.duration(200)}>
          <EntryPreview
            subCategory={subCategory}
            amount={amount}
            description={dayjs(date).format('HH:mm - ddd D MMM')}
          />
          <Padder h={0.5} />
          <PreviewDisclaimer />
        </Animated.View>
      )}
      <Padder />
    </Content>
  )
}
