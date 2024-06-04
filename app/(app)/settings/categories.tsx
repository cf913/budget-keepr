import {ThemedButton} from '@/components/Buttons/ThemedButton'
import Content from '@/components/Layout/Content'
import Padder from '@/components/Layout/Padder'
import Page from '@/components/Layout/Page'
import List from '@/components/Lists/List'
import ListItem from '@/components/Lists/ListItem'
import {Loader} from '@/components/Loader'
import {ThemedText} from '@/components/ThemedText'
import {getCategories} from '@/data/categories'
import {isLastItem} from '@/utils/helpers'
import {useQuery} from '@tanstack/react-query'
import {router, useLocalSearchParams} from 'expo-router'
import {useState} from 'react'

export default function Categories() {
  const {from} = useLocalSearchParams()
  const [refreshing, setRefreshing] = useState(false)

  const {data, error, refetch, isLoading} = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  })

  // console.log('isPending', isPending)
  // console.log('data', JSON.stringify(data, null, 2))
  // console.log('isError', isError)
  // console.log('error', error?.message)

  return (
    <Page
      scroll
      title="Main Categories"
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
          onPress={() => router.push('/settings/category-create')}
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
                  href={{
                    pathname: '/settings/category/[id]',
                    params: {id: category.id},
                  }}
                  title={category.name}
                  right={category.sub_categories?.length}
                  key={category.id}
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
      <Padder />
      <Padder />
    </Page>
  )
}
