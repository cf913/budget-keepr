import Content from '@/components/Layout/Content'
import Padder from '@/components/Layout/Padder'
import Page from '@/components/Layout/Page'
import List from '@/components/Lists/List'
import ListItem from '@/components/Lists/ListItem'
import ListItemSkeleton from '@/components/Lists/ListItemSkeleton'
import { Loader } from '@/components/Loader'
import { ThemedView } from '@/components/ThemedView'
import { HEIGHT, PADDING, RADIUS } from '@/constants/Styles'
import { getEntries } from '@/data/entries'
import { useThemeColor } from '@/hooks/useThemeColor'
import Toasty from '@/lib/Toasty'
import { queryClient } from '@/lib/tanstack'
import { useLocalSettings } from '@/stores/localSettings'
import { toMoney } from '@/utils/helpers'
import { Feather } from '@expo/vector-icons'
import { FlashList } from '@shopify/flash-list'
import { useInfiniteQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { router } from 'expo-router'
import React, { Fragment, useMemo } from 'react'
import { Animated } from 'react-native'
import { RectButton, Swipeable } from 'react-native-gesture-handler'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const PAGE_SIZE = 18

export default function Entries() {
  const insets = useSafeAreaInsets()
  const { defaultBudget } = useLocalSettings()
  const textColor = useThemeColor({}, 'text')
  const backgroundColor = useThemeColor({}, 'bg_secondary')

  const {
    data: { pages, pageParams } = { pages: [], pageParams: [] },
    error,
    refetch,
    isLoading,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
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

  if (error) Toasty.error(error.message)

  const data = useMemo(() => pages.flat(), [pages])

  const onEdit = (id: string) => {
    alert('GO TO EDIT ENTRY')
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
        {isLoading || isRefetching ? (
          <List style={{ marginBottom: PADDING, zIndex: 2 }}>
            {[...Array(5).keys()].map((v: number, i: number) => {
              return (
                <ListItemSkeleton
                  key={v}
                  lastItem={i === (pages || []).length - 1}
                />
              )
            })}
          </List>
        ) : (
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
              <FlashList
                data={data}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: insets.bottom }}
                onEndReached={fetchNextPage}
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
                              <Feather
                                name="edit"
                                size={24}
                                color={textColor}
                              />
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
                  isFetchingNextPage ? (
                    <ThemedView>
                      <Padder />
                      <Loader />
                      <Padder />
                    </ThemedView>
                  ) : null
                }
                estimatedItemSize={HEIGHT.item}
              />
            </ThemedView>
          </List>
        )}
      </Content>
    </Page>
  )
}
