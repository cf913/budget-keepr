import { FlashList } from '@shopify/flash-list'
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { router } from 'expo-router'
import React, { useCallback } from 'react'
import { Alert, RefreshControl } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import Content from '@/components/Layout/Content'
import Page from '@/components/Layout/Page'
import EntryListItem from '@/components/Lists/EntryListItem'
import List from '@/components/Lists/List'
import ListEmpty from '@/components/Lists/ListEmpty'
import ListFooter from '@/components/Lists/ListFooter'
import { Entry } from '@/components/RecentEntries'
import ErrorScreen from '@/components/Screens/ErrorScreen'
import { ThemedView } from '@/components/ThemedView'
import { HEIGHT } from '@/constants/Styles'
import { deleteEntry, getEntries } from '@/data/entries'
import { useRefreshOnFocus } from '@/hooks/useRefreshOnFocus'
import { useThemeColor } from '@/hooks/useThemeColor'
import Toasty from '@/lib/Toasty'
import { useLocalSettings } from '@/stores/localSettings'

const PAGE_SIZE = 18

export default function Entries() {
  const queryClient = useQueryClient()
  const insets = useSafeAreaInsets()
  const { defaultBudget } = useLocalSettings()
  const backgroundColor = useThemeColor({}, 'bg_secondary')

  // Query for fetching entries
  const {
    data,
    error,
    refetch,
    isLoading,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isRefetching,
  } = useInfiniteQuery({
    queryKey: ['infinite_entries', defaultBudget?.id],
    queryFn: ({ pageParam = 0 }: { pageParam?: number }) =>
      getEntries(defaultBudget?.id, {
        limit: PAGE_SIZE,
        offset: pageParam,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, _, lastPageParam) => {
      if (!lastPage || lastPage.length < PAGE_SIZE) return null
      return lastPageParam + PAGE_SIZE + 1
    },
  })

  useRefreshOnFocus(refetch)

  // Mutation for deleting entries
  const mutation = useMutation({
    mutationFn: deleteEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['infinite_entries', defaultBudget?.id],
      })
      queryClient.invalidateQueries({ queryKey: ['Analytics'] })
      queryClient.invalidateQueries({ queryKey: ['entries'] })
      Toasty.success('Entry deleted')
    },
    onError: error => {
      console.error('Delete error:', error.message)
      Toasty.error('Failed to delete entry')
    },
  })

  // Handle edit action
  const onEdit = useCallback((id: string) => {
    router.navigate(`/(main)/entries/${id}`)
  }, [])

  // Handle delete action
  const onDelete = useCallback(
    (id: string) => {
      Alert.alert('Confirm delete?', 'This action cannot be undone.', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: () => mutation.mutate(id),
          style: 'destructive',
        },
      ])
    },
    [mutation],
  )

  // Render list item
  const renderItem = useCallback(
    ({ item, index }: { item: Entry | undefined; index: number }) => {
      if (!item) return null
      return (
        <EntryListItem
          item={item}
          index={index}
          totalItems={data?.pages.flat().length || 0}
          onEdit={onEdit}
          onDelete={onDelete}
          backgroundColor={backgroundColor}
        />
      )
    },
    [data, onEdit, onDelete, backgroundColor],
  )

  // Handle end reached (for pagination)
  const onEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  // Handle error state
  if (error) {
    Toasty.error(error.message)
    return <ErrorScreen error={error.message} />
  }

  const flattenedData: (Entry | undefined)[] = data?.pages.flat() || []

  const keyExtractor = (item: Entry | undefined, i: number) =>
    item?.id || i.toString()

  return (
    <Page back title="Entries">
      <Content style={{ flexGrow: 1, height: 0 }}>
        <List style={{ zIndex: 2, position: 'relative' }}>
          <ThemedView style={{ flexGrow: 1, flexDirection: 'row' }}>
            <FlashList
              data={flattenedData}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: insets.bottom }}
              onEndReached={onEndReached}
              keyExtractor={keyExtractor}
              renderItem={renderItem}
              ListEmptyComponent={
                <ListEmpty isLoading={isLoading} hasNextPage={hasNextPage} />
              }
              ListFooterComponent={
                <ListFooter
                  isFetchingNextPage={isFetchingNextPage}
                  hasNextPage={hasNextPage}
                />
              }
              estimatedItemSize={HEIGHT.item}
              refreshControl={
                <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
              }
            />
          </ThemedView>
        </List>
      </Content>
    </Page>
  )
}
