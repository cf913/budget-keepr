import { PADDING, TYPO } from '@/constants/Styles'
import { deleteEntry } from '@/data/entries'
import { getEntries } from '@/data/queries'
import { useThemeColor } from '@/hooks/useThemeColor'
import { queryClient } from '@/lib/tanstack'
import { useLocalSettings } from '@/stores/localSettings'
import { toMoney } from '@/utils/helpers'
import { useMutation, useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { BlurView } from 'expo-blur'
import { Alert } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { AnalyticsQueryKeys } from './Analytics'
import Padder from './Layout/Padder'
import List from './Lists/List'
import ListItem from './Lists/ListItem'
import ListItemSkeleton from './Lists/ListItemSkeleton'
import { ThemedText } from './ThemedText'

import { useEffect } from 'react'

export interface Category {
  id: string
  name: string
  color: string
}

export interface SubCategory {
  id: string
  name: string
  category: Category
}

export interface Entry {
  id: string
  amount: number
  created_at: string
  category: Category
  sub_category: SubCategory
}

export default function RecentEntries({
  counter,
  setCounter,
}: {
  counter: number
  setCounter: (value: number) => void
}) {
  const { defaultBudget } = useLocalSettings()
  const textColor = useThemeColor({}, 'text')

  const {
    data: entries = [],
    error,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['entries'],
    queryFn: () => getEntries(defaultBudget?.id),
  })

  useEffect(() => {
    refetch()
  }, [refetch, counter])

  const mutation = useMutation({
    mutationFn: (entryId: string) => deleteEntry(entryId),
    // onMutate(variables) {

    // },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['entries', ...AnalyticsQueryKeys],
      })
      setCounter(counter + 1)
      refetch()
    },
    onError: error => {
      console.log('error', error.message)
      alert('Oops. ' + error.message)
    },
  })

  if (error) alert(error.message)

  const onDelete = async (id: string) => {
    Alert.alert('Confirm delete?', 'This action cannot be undone.', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'Delete',
        onPress: () => mutation.mutate(id),
        style: 'destructive',
      },
    ])
  }

  return isLoading || isRefetching ? (
    <List style={{ marginBottom: PADDING, zIndex: 2 }}>
      {[...Array(entries?.length || 3).keys()].map((v: number, i: number) => {
        return (
          <ListItemSkeleton
            key={v}
            lastItem={i === (entries || []).length - 1}
          />
        )
      })}
    </List>
  ) : (
    <List
      style={{
        // marginBottom: PADDING,
        zIndex: 2,
        position: 'relative',
      }}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <Padder style={{ height: PADDING / 2 + 20 }} />
        {(entries || []).map((entry: Entry, i: number) => {
          return (
            <ListItem
              key={entry.id}
              lastItem={i === (entries || []).length - 1}
              href={'entries'}
              title={entry.sub_category?.name}
              description={dayjs(entry.created_at).format('HH:mm - ddd D MMM')}
              category={entry.category}
              right={toMoney(entry.amount)}
            />
          )
        })}
      </ScrollView>
      <BlurView
        // intensity={50}
        style={{
          paddingLeft: PADDING,
          paddingVertical: PADDING / 2,
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
        }}
      >
        <ThemedText
          style={{
            ...TYPO.small,
            fontWeight: 'bold',
            color: textColor,
          }}
        >
          Recent entries
        </ThemedText>
      </BlurView>
    </List>
  )
}
