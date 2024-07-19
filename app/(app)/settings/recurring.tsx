import { Page, Padder } from '@/components/Layout'
import RecurringListActive from '@/components/Lists/RecurringListActive'
import RecurringListArchived from '@/components/Lists/RecurringListArchived'
import { RecurringUpdateInput, updateRecurring } from '@/data/recurring'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRef, useState } from 'react'
import { Alert } from 'react-native'

// TODO: use forwardRef + useImperativeHandle to call refetch for both lists on pull down

export type RecurringUpdateType = 'active' | 'archived'

export default function Recurrings() {
  const activeListRef = useRef<any>() // HACK: make this not <any>
  const archivedListRef = useRef<any>() // HACK: make this not <any>
  const [refreshing, setRefreshing] = useState(false)
  const queryClient = useQueryClient()

  const updateMutation = useMutation({
    mutationFn: updateRecurring,
    onMutate: variables => {
      console.log('updateMutation optimistic update', variables)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['recurringActive', 'recurringArchived'],
      })
      activeListRef.current?.refetch()
      archivedListRef.current?.refetch()
    },
    onError: error => {
      console.log('error', error.message)
      alert('Oops. ' + error.message)
    },
  })

  const onDelete = async (id: string) => {
    Alert.alert('Confirm delete?', 'This action cannot be undone.', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'Delete',
        onPress: () => {
          // queryClient.invalidateQueries({ queryKey: ['recurringActive', 'recurringArchived'] })
          alert('TODO: make it delete ' + id) // TODO: deleteMutation.mutate(id),
        },
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
        if (recurring.active) {
          alertTitle = `Confirm reactivate?`
          alertMessage = 'Your recurring payment will resume shortly.'
          alertButton = `Reactivate`
        } else {
          alertTitle = `Confirm pause?`
          alertMessage =
            'Your recurring payment will expire at the end of the current billing cycle. You can resume it at any time before expiry. However, once expired, a recurring payment cannot be reactivated and a new one must be created.'
          alertButton = `Pause`
        }
        break
      case 'archived':
        if (!recurring.archived) {
          alertTitle = `Unarchive?`
          alertMessage = `This will unarchive the recurring payment. It will be visible in the recurring payment list.`
          alertButton = `Unarchive`
        } else {
          // default settings
        }

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
      onRefresh={() => {
        setRefreshing(true)
        activeListRef.current?.refetch()
        archivedListRef.current?.refetch()
        setRefreshing(false)
      }}
    >
      <RecurringListActive
        ref={activeListRef}
        onDelete={onDelete}
        onUpdate={onUpdate}
      />
      <Padder />
      <RecurringListArchived
        ref={archivedListRef}
        onDelete={onDelete}
        onUpdate={onUpdate}
      />

      <Padder />
      <Padder />
    </Page>
  )
}
