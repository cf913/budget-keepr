import Content from '@/components/Layout/Content'
import Padder from '@/components/Layout/Padder'
import Page from '@/components/Layout/Page'
import List from '@/components/Lists/List'
import ListItem from '@/components/Lists/ListItem'
import { Loader } from '@/components/Loader'
import { ThemedText } from '@/components/ThemedText'
import { getRecurrings } from '@/data/recurring'
import { useLocalSettings } from '@/stores/localSettings'
import { isLastItem } from '@/utils/helpers'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useState } from 'react'

export default function Recurring() {
  const [refreshing, setRefreshing] = useState(false)
  const { defaultBudget } = useLocalSettings()

  const { data, error, refetch, isLoading } = useQuery({
    queryKey: ['recurring'],
    queryFn: () => getRecurrings(defaultBudget?.id),
  })

  if (error) {
    console.log('error', error.message)
    alert('Oops. ' + error.message)
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
                <ListItem
                  title={recurring.sub_category.name}
                  right={recurring.active ? 'Active' : 'Inactive'}
                  key={recurring.id}
                  lastItem={isLastItem(data, i)}
                  description={`Renews ${dayjs(recurring.next_at).format(
                    'ddd D MMM YYYY'
                  )}`}
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
