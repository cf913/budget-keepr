import { ThemedButton } from '@/components/Buttons/ThemedButton'
import CategorySuggestions from '@/components/CategorySuggestions'
import ThemedInput from '@/components/Inputs/ThemedInput'
import { Content, Padder, Page, Spacer } from '@/components/Layout'
import { Loader } from '@/components/Loader'
import EntryPreview from '@/components/Preview/EntryPreview'
import PreviewDisclaimer from '@/components/Preview/PreviewDisclaimer'
import { Entry, SubCategory } from '@/components/RecentEntries'
import { ThemedText } from '@/components/ThemedText'
import { AnimatedView, ThemedView } from '@/components/ThemedView'
import { getEntry } from '@/data/entries'
import { updateEntry } from '@/data/mutations'
import { useColors } from '@/hooks/useColors'
import Toasty from '@/lib/Toasty'
import { getSQLFriendlyMonth, getWeekNumber } from '@/utils/helpers'
import { Feather } from '@expo/vector-icons'
import DateTimePicker from '@react-native-community/datetimepicker'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { router, useLocalSearchParams } from 'expo-router'
import React, { useRef, useState } from 'react'
import { Keyboard, Pressable, TextInput } from 'react-native'
import {
  FadeInUp,
  FadeOutDown,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function EntryPresenter() {
  const { id } = useLocalSearchParams<{ id: string }>()

  console.log('ID', id)

  const { data, error, isLoading } = useQuery({
    queryKey: ['entry', id],
    queryFn: () => getEntry(id),
  })

  if (isLoading) {
    return <Loader />
  }

  if (error) {
    Toasty.error(error.message)
    router.back()
    return
  }

  if (!data) {
    Toasty.error('Entry not found')
    router.back()
    return
  }

  const screenProps: { entry: Entry; isLoading: boolean } = {
    entry: {
      ...data,
      sub_category: { ...data.sub_category, category: data.category },
    },
    isLoading: isLoading,
  }

  return <EntryScreen {...screenProps} />
}

function EntryScreen({ entry }: { entry: Entry; isLoading: boolean }) {
  // hooks
  const subCategoryInput = useRef<TextInput>(null)
  const insets = useSafeAreaInsets()
  const translateValue = useSharedValue(48 + 8) // 48 is the height of the input and 8 is the padding
  const opacityValue = useSharedValue(1)
  const { textColor, bgColor2 } = useColors()
  const queryClient = useQueryClient()

  // state
  const [date, setDate] = useState<Date>(new Date(entry.created_at))
  const [suggestionsVisible, setSuggestionsVisible] = useState(false)
  const [saving, setSaving] = useState(false)
  const [amount, setAmount] = useState<string>((entry.amount / 100).toString())
  const [subCategory, setSubCategory] = useState<SubCategory | null>(
    entry.sub_category,
  )
  const [subCategorySearchText, setSubCategorySearchText] = useState<string>(
    entry.sub_category.name,
  )

  // 1
  const mutationEntry = useMutation({
    mutationFn: updateEntry,
    onSuccess: () => {
      // if recurring entry then create recurring
      // carry on with normal entry
      queryClient.invalidateQueries({
        queryKey: ['entries'],
      })

      queryClient.invalidateQueries({
        queryKey: ['infinite_entries'],
      })

      // for (const qk of AnalyticsQueryKeys) {
      //   queryClient.invalidateQueries({
      //     queryKey: [qk],
      //   })
      // }

      setSaving(false)
      Toasty.success('Entry updated ✅')
      return router.back()
    },
    onError: error => {
      console.log('error', error.message)
      Toasty.error(error.message)
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
      id: entry.id,
      amount: Math.round(+amount * 100),
      created_at: date.toISOString(),
      // updated_at: new Date().toISOString(),
      sub_category_id: subCategory.id,
      category_id: subCategory.category?.id,
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

  const goToNewCategory = () => {
    router.navigate('/new-category')
  }

  return (
    <Page
      down
      title="Edit Entry"
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
            onSubmitEditing={() => {
              subCategory
                ? Keyboard.dismiss()
                : subCategoryInput?.current?.focus()
            }}
            blurOnSubmit={false}
          />
        </AnimatedView>

        {/* CATEGORY */}
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
                  withTiming(48 + 8, { duration: 200 }),
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
                // borderColor: tintColor,
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
        <Padder />
        {subCategory ? (
          <AnimatedView entering={FadeInUp} exiting={FadeOutDown.duration(200)}>
            <EntryPreview
              subCategory={subCategory}
              amount={amount}
              description={dayjs(date).format('HH:mm - ddd D MMM')}
            />
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
