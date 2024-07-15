import Content from '@/components/Layout/Content'
import Padder from '@/components/Layout/Padder'
import Page from '@/components/Layout/Page'
import List from '@/components/Lists/List'
import ListItem from '@/components/Lists/ListItem'
import ListItemSkeleton from '@/components/Lists/ListItemSkeleton'
import { Loader } from '@/components/Loader'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { HEIGHT, PADDING, RADIUS, TYPO } from '@/constants/Styles'
import { deleteEntry, getEntries } from '@/data/entries'
import { useRefreshOnFocus } from '@/hooks/useRefreshOnFocus'
import { useThemeColor } from '@/hooks/useThemeColor'
import Toasty from '@/lib/Toasty'
import { useLocalSettings } from '@/stores/localSettings'
import { toMoney } from '@/utils/helpers'
import { Feather } from '@expo/vector-icons'
import { FlashList } from '@shopify/flash-list'
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import dayjs from 'dayjs'
import { router } from 'expo-router'
import React, { Fragment, useMemo, useRef } from 'react'
import { Alert, Animated } from 'react-native'
import { RectButton, Swipeable } from 'react-native-gesture-handler'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const PAGE_SIZE = 18

export default function Entries() {
  const queryClient = useQueryClient()
  const insets = useSafeAreaInsets()
  const { defaultBudget } = useLocalSettings()
  const textColor = useThemeColor({}, 'text')
  const backgroundColor = useThemeColor({}, 'bg_secondary')

  const {
    data: { pages, pageParams } = { pages: [], pageParams: [] },
    error,
    refetch,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isFetching,
    isRefetching,
  } = useInfiniteQuery({
    queryKey: ['infinite_entries', defaultBudget?.id],
    queryFn: ({ pageParam }) => {
      return getEntries(defaultBudget?.id, {
        limit: PAGE_SIZE,
        offset: pageParam,
      })
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages, lastPageParam) => {
      if (!lastPage) {
        return null
      }
      if (lastPage?.length < PAGE_SIZE) {
        return null
      }
      return lastPageParam + PAGE_SIZE + 1 // range is inclusive, need to add one
    },
  })

  useRefreshOnFocus(refetch)

  if (error) Toasty.error(error.message)

  const data = useMemo(() => pages.flat(), [pages])

  const onEdit = (id: string) => {
    router.navigate('/(main)/entries/' + id)
  }

  const mutation = useMutation({
    mutationFn: (entryId: string) => deleteEntry(entryId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['infinite_entries', defaultBudget?.id],
      })
      queryClient.invalidateQueries({
        queryKey: ['Analytics'],
      })
      queryClient.invalidateQueries({
        queryKey: ['entries'],
      })
      Toasty.success('Entry deleted')
    },
    onError: error => {
      console.log('error', error.message)
      alert('Oops. ' + error.message)
    },
  })

  if (error) alert(error.message)

  const onDelete = (id: string) => {
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

  return (
    <Page
      back
      title="Entries"
      refreshing={isRefetching}
      onRefresh={() => {
        queryClient.invalidateQueries({
          queryKey: ['infinite_entries', defaultBudget?.id],
        })
        refetch()
      }}
    >
      <Content style={{ flexGrow: 1, height: 0 }}>
        <List
          style={{
            zIndex: 2,
            position: 'relative',
          }}
        >
          <ThemedView
            style={{
              flexGrow: 1,
              flexDirection: 'row',
            }}
          >
            {/* <ThemedText>Testing new comment plugin</ThemedText> */}
            <FlashList
              data={data}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: insets.bottom }}
              onEndReached={() => !isFetching && fetchNextPage()}
              keyExtractor={(item, i) => item?.id || i.toString()}
              renderItem={({ item, index }) => {
                if (!item) return null
                return (
                  <Swipeable
                    key={item.id}
                    containerStyle={[
                      {
                        backgroundColor,
                      },
                      index === 0
                        ? {
                          borderTopLeftRadius: RADIUS,
                          borderTopRightRadius: RADIUS,
                        }
                        : undefined,
                      index === data.length - 1
                        ? {
                          borderBottomLeftRadius: RADIUS,
                          borderBottomRightRadius: RADIUS,
                        }
                        : undefined,
                    ]}
                    renderRightActions={() => (
                      <Fragment>
                        <RectButton
                          // EDIT BUTTON
                          style={[
                            {},
                            {
                              width: 50,
                              justifyContent: 'center',
                              alignItems: 'center',
                              backgroundColor,
                            },
                          ]}
                          onPress={() => onEdit(item.id)}
                        >
                          <Animated.Text
                            style={[
                              // styles.actionText,
                              {
                                // transform: [{translateX: trans}],
                              },
                            ]}
                          >
                            <Feather name="edit" size={24} color={textColor} />
                          </Animated.Text>
                        </RectButton>
                        <RectButton
                          // DELETE BUTTON
                          style={[
                            {},
                            {
                              width: 50,
                              justifyContent: 'center',
                              alignItems: 'center',
                              backgroundColor,
                            },
                          ]}
                          onPress={() => onDelete(item.id)}
                        >
                          <Animated.Text
                            style={[
                              // styles.actionText,
                              {
                                // transform: [{translateX: trans}],
                              },
                            ]}
                          >
                            <Feather name="trash-2" size={24} color={'red'} />
                          </Animated.Text>
                        </RectButton>
                      </Fragment>
                    )}
                  >
                    <ListItem
                      key={item.id}
                      firstItem={index === 0}
                      lastItem={index === data.length - 1}
                      href={'entries'}
                      showHrefIcon={false}
                      title={item.sub_category?.name}
                      description={dayjs(item.created_at).format(
                        'HH:mm - ddd D MMM',
                      )}
                      category={item.category}
                      right={toMoney(item.amount)}
                    />
                  </Swipeable>
                )
              }}
              ListFooterComponent={
                <>
                  {isFetchingNextPage ? (
                    <ThemedView>
                      <Padder />
                      <Loader />
                      <Padder />
                    </ThemedView>
                  ) : null}
                  {hasNextPage ? null : (
                    <ThemedView
                      style={{ justifyContent: 'center', alignItems: 'center' }}
                    >
                      <Padder />
                      <ThemedText style={{ ...TYPO.small }}>
                        You're up to date
                      </ThemedText>
                      <Padder />
                    </ThemedView>
                  )}
                </>
              }
              estimatedItemSize={HEIGHT.item}
            />
          </ThemedView>
        </List>
      </Content>
    </Page>
  )
}
