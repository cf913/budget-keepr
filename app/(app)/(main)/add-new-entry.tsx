import { useMutation, useQueryClient } from '@tanstack/react-query'
import { router } from 'expo-router'
import React, { useCallback, useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { ThemedButton } from '@/components/Buttons/ThemedButton'
import EntryForm from '@/components/Forms/EntryForm'
import { Content, Padder, Page, Spacer } from '@/components/Layout'
import { SubCategory } from '@/components/RecentEntries'
import { ThemedView } from '@/components/ThemedView'
import { createEntry } from '@/data/mutations'
import { createRecurring } from '@/data/recurring'
import Toasty from '@/lib/Toasty'
import { useLocalSettings } from '@/stores/localSettings'
import { useTempStore } from '@/stores/tempStore'
import {
  getDayJSFrequencyFromString,
  getSQLFriendlyMonth,
  getWeekNumber,
} from '@/utils/helpers'
import dayjs from 'dayjs'

export default function AddNewEntry() {
  const insets = useSafeAreaInsets()
  const queryClient = useQueryClient()

  const { defaultBudget } = useLocalSettings()
  const { selectedFrequency } = useTempStore()

  const [date, setDate] = useState<Date>(new Date())
  const [saving, setSaving] = useState(false)
  const [amount, setAmount] = useState<string>('')
  const [subCategory, setSubCategory] = useState<SubCategory | null>(null)
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
      <EntryForm
        {...{
          amount,
          setAmount,
          subCategory,
          setSubCategory,
          date,
          setDate,
          isRecurring,
          setRecurring,
        }}
      />
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
