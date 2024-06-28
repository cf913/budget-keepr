import Content from '@/components/Layout/Content'
import Padder from '@/components/Layout/Padder'
import Page from '@/components/Layout/Page'
import List from '@/components/Lists/List'
import ListItemRecurring from '@/components/Lists/ListItemRecurring'
import { Loader } from '@/components/Loader'
import { ThemedText } from '@/components/ThemedText'
import {
  Recurring,
  RecurringUpdateInput,
  deleteRecurring,
  getRecurrings,
  updateRecurring,
} from '@/data/recurring'
import { useLocalSettings } from '@/stores/localSettings'
import { isLastItem } from '@/utils/helpers'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Alert } from 'react-native'

export type RecurringUpdateType = 'active' | 'archived'

export default function Recurrings() {
  const [refreshing, setRefreshing] = useState(false)
  const { defaultBudget } = useLocalSettings()

  const { data, error, refetch, isLoading } = useQuery({
    queryKey: ['recurring'],
    queryFn: () => getRecurrings(defaultBudget?.id),
  })

  const updateMutation = useMutation({
    mutationFn: updateRecurring,
    onMutate: variables => {
      console.log('updateMutation optimistic update', variables)
    },
    onSuccess: () => {
      refetch()
    },
    onError: error => {
      console.log('error', error.message)
      alert('Oops. ' + error.message)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteRecurring,
    onMutate: variables => {
      console.log('deleteMutation optimistic update', variables)
    },
    onSuccess: () => {
      refetch()
    },
    onError: error => {
      console.log('error', error.message)
      alert('Oops. ' + error.message)
    },
  })

  if (error) {
    console.log('error', error.message)
    alert('Oops. ' + error.message)
  }

  const onDelete = async (id: string) => {
    Alert.alert('Confirm delete?', 'This action cannot be undone.', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'Delete',
        onPress: () => alert('TODO: make it delete ' + id), // deleteMutation.mutate(id),
        style: 'destructive',
      },
    ])
  }

  const onUpdate = (
    recurringType: RecurringUpdateType,
    recurring: RecurringUpdateInput,
  ) => {
    let alertTitle = `Confirm archive?`
    let alertMessage =
      'Please make sure to pause/stop first. Your recurring payment will hidden away in a hidden list. Out of sight, out of mind.'
    let alertButton = `Archive`

    switch (recurringType) {
      case 'active':
        alertTitle = `Confirm pause?`
        alertMessage =
          'Your recurring payment will expire at the end of the current billing cycle. You can resume it at any time before expiry. However, once expired, a recurring payment cannot be resumed and a new one must be created.'
        alertButton = `Pause`
        break
      case 'archived':
        // default settings
        break
      default:
        break
    }

    Alert.alert(alertTitle, alertMessage, [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: alertButton,
        onPress: () => updateMutation.mutate(recurring),
        style: 'destructive',
      },
    ])
  }

  return (
    <Page
      scroll
      title="Recurring Payments"
      back
      refreshing={refreshing}
      onRefresh={async () => {
        setRefreshing(true)
        await refetch()
        setRefreshing(false)
      }}
    >
      <Content>
        {isLoading ? <Loader /> : null}
        {data ? (
          <List>
            {(data || []).map((recurring, i) => {
              return (
                <ListItemRecurring
                  key={recurring.id}
                  recurring={recurring}
                  onDelete={onDelete}
                  onUpdate={onUpdate}
                  lastItem={isLastItem(data, i)}
                />
              )
            })}
          </List>
        ) : null}
        {data && !data.length ? (
          <ThemedText>
            Looks like you don't have any recurring at this very point in time.
            Nice 💪
          </ThemedText>
        ) : null}
        {error ? <ThemedText>Error: {error.message}</ThemedText> : null}
      </Content>
      <Padder />
      <Padder />
    </Page>
  )
}
