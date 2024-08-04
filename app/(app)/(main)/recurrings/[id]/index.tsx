import { ThemedButton } from '@/components/Buttons/ThemedButton'
import EntryForm from '@/components/Forms/EntryForm'
import { Page, Content, Padder, Spacer } from '@/components/Layout'
import { Loader } from '@/components/Loader'
import { SubCategory } from '@/components/RecentEntries'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { Recurring, getRecurring } from '@/data/recurring'
import Toasty from '@/lib/Toasty'
import { useTempStore } from '@/stores/tempStore'
import { useQuery } from '@tanstack/react-query'
import { router, useLocalSearchParams } from 'expo-router'
import { useState, useCallback, useEffect } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function EditRecurringPresenter() {
  const { id } = useLocalSearchParams<{ id: string }>()

  console.log('ID', id)

  const { data, error, isLoading } = useQuery({
    queryKey: ['recurring', id],
    queryFn: () => getRecurring(id),
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
    Toasty.error('Recurring not found')
    router.back()
    return
  }

  console.log('DATA', data)

  const screenProps: { recurring: Recurring; isLoading: boolean } = {
    recurring: {
      ...data,
      sub_category: { ...data.sub_category, category: data.category },
    },
    isLoading: isLoading,
  }

  return <EditRecurringScreen {...screenProps} />
}

function EditRecurringScreen({
  recurring,
}: {
  recurring: Recurring
  isLoading: boolean
}) {
  const { setSelectedFrequency } = useTempStore()
  // state
  const [date, setDate] = useState<Date>(new Date(recurring.next_at))

  const [saving, setSaving] = useState(false)
  const [amount, setAmount] = useState<string>(
    (recurring.amount / 100).toString(),
  )
  const [subCategory, setSubCategory] = useState<SubCategory | null>(
    recurring.sub_category,
  )

  useEffect(() => {
    setSelectedFrequency(recurring.frequency)
  }, [recurring.frequency])

  const handleSave = useCallback(() => {
    setSaving(true)
    Toasty.success('Recurring payment saved!')
    router.replace('/(main)')
  }, [])
  const insets = useSafeAreaInsets()
  return (
    <Page
      down
      title="Edit Recurring"
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
          recurring: true,
          isRecurring: true,
          setRecurring: () => {},
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
