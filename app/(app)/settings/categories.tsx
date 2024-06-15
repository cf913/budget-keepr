import {ThemedButton} from '@/components/Buttons/ThemedButton'
import Content from '@/components/Layout/Content'
import Padder from '@/components/Layout/Padder'
import Page from '@/components/Layout/Page'
import List from '@/components/Lists/List'
import ListItem from '@/components/Lists/ListItem'
import {Loader} from '@/components/Loader'
import {ThemedText} from '@/components/ThemedText'
import {isAdmin} from '@/data/api'
import {getCategories} from '@/data/categories'
import {useSession} from '@/stores/session'
import {isLastItem} from '@/utils/helpers'
import {useQuery} from '@tanstack/react-query'
import {router} from 'expo-router'
import {useState} from 'react'

export default function Categories() {
  const [refreshing, setRefreshing] = useState(false)
  const {session} = useSession()

  const {data, error, refetch, isLoading} = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  })

  // const {data: isUserAdmin} = useQuery({
  //   queryKey: ['isAdmin'],
  //   queryFn: isAdmin,
  // })

  // console.log('isPending', isPending)
  // console.log('data', JSON.stringify(data, null, 2))
  // console.log('isError', isError)
  if (error) {
    console.log('error', error.message)
    alert('Oops. ' + error.message)
  }

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
        isAdmin(session) ? (
          <ThemedButton
            round
            onPress={() => router.push('/settings/category-create')}
            title=""
            style={{zIndex: 99}}
          ></ThemedButton>
        ) : null
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
                  category={category}
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
