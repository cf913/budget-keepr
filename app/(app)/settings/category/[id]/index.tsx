import {ThemedButton} from '@/components/Buttons/ThemedButton'
import Content from '@/components/Layout/Content'
import Page from '@/components/Layout/Page'
import List from '@/components/Lists/List'
import ListItem from '@/components/Lists/ListItem'
import {Loader} from '@/components/Loader'
import {ThemedText} from '@/components/ThemedText'
import {getCategory} from '@/data/categories'
import {getSubCategories} from '@/data/sub_categories'
import {isLastItem} from '@/utils/helpers'
import {useQuery} from '@tanstack/react-query'
import {router, useLocalSearchParams} from 'expo-router'
import {useState} from 'react'

export default function Category() {
  const {id} = useLocalSearchParams<{id: string}>()

  const [refreshing, setRefreshing] = useState(false)

  const dataCategory = useQuery({
    queryKey: ['category', id],
    queryFn: () => getCategory(id),
  })

  const {data, error, refetch, isLoading} = useQuery({
    queryKey: ['sub_categories', id],
    queryFn: () => getSubCategories(id),
  })

  return (
    <Page
      scroll
      title={dataCategory?.data?.name || ''}
      back
      refreshing={refreshing}
      onRefresh={async () => {
        setRefreshing(true)
        await refetch()
        setRefreshing(false)
      }}
      footer={
        <ThemedButton
          round
          onPress={() => router.push(`/settings/category/${id}/create`)}
          title=""
          style={{zIndex: 99}}
        ></ThemedButton>
      }
    >
      <Content>
        {isLoading ? <Loader /> : null}
        {data ? (
          <List>
            {(data || []).map((category, i) => {
              return (
                <ListItem
                  // href={{
                  //   pathname: '/settings/category/[id]',
                  //   params: {id: category.id},
                  // }}
                  title={category.name}
                  key={category.id}
                  category={dataCategory?.data}
                  lastItem={isLastItem(data, i)}
                />
              )
            })}
          </List>
        ) : null}
        {data && !data.length ? (
          <ThemedText>
            Looks like you don't have any categories at this very point in time.
          </ThemedText>
        ) : null}
        {error ? <ThemedText>Error: {error.message}</ThemedText> : null}
      </Content>
    </Page>
  )
}
