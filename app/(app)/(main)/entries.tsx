import { ThemedButton } from '@/components/Buttons/ThemedButton'
import Content from '@/components/Layout/Content'
import Page from '@/components/Layout/Page'
import List from '@/components/Lists/List'
import ListItem from '@/components/Lists/ListItem'
import ListItemSkeleton from '@/components/Lists/ListItemSkeleton'
import { Entry } from '@/components/RecentEntries'
import { ThemedText } from '@/components/ThemedText'
import { PADDING } from '@/constants/Styles'
import { getEntries } from '@/data/entries'
import { useThemeColor } from '@/hooks/useThemeColor'
import Toasty from '@/lib/Toasty'
import { queryClient } from '@/lib/tanstack'
import { useLocalSettings } from '@/stores/localSettings'
import { toMoney } from '@/utils/helpers'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { ScrollView } from 'react-native'

const PAGE_SIZE = 17

export default function Entries() {
  const { defaultBudget } = useLocalSettings()
  const textColor = useThemeColor({}, 'text')

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

  // console.log('PAGES', JSON.stringify(pages, null, 2))
  // console.log('PAGES_PARAMS', JSON.stringify(pageParams, null, 2))

  return (
    <Page
      scroll
      title="Entries"
      back
      refreshing={isRefetching}
      onRefresh={() => {
        queryClient.invalidateQueries({
          queryKey: ['infinite_entries', defaultBudget?.id],
        })
        refetch()
      }}
    >
      <Content>
        {isLoading || isRefetching ? (
          <List style={{ marginBottom: PADDING, zIndex: 2 }}>
            {[...Array(pages?.length || 3).keys()].map(
              (v: number, i: number) => {
                return (
                  <ListItemSkeleton
                    key={v}
                    lastItem={i === (pages || []).length - 1}
                  />
                )
              },
            )}
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
              {(pages || []).map((page: any, i: number) => {
                return page.map((entry: Entry, j: number) => {
                  return (
                    <ListItem
                      key={entry.id}
                      lastItem={j === (pages || []).length - 1}
                      href={'entries'}
                      showHrefIcon={false}
                      title={entry.sub_category?.name}
                      description={dayjs(entry.created_at).format(
                        'HH:mm - ddd D MMM',
                      )}
                      category={entry.category}
                      right={toMoney(entry.amount)}
                    />
                  )
                })
              })}
              <ThemedText>
                {hasNextPage ? 'Has Next Page' : 'No Next Page'}
              </ThemedText>
              <ThemedButton
                title="Load More"
                onPress={fetchNextPage}
                loading={isFetchingNextPage}
              />
            </ScrollView>
          </List>
        )}
      </Content>
    </Page>
  )
}
