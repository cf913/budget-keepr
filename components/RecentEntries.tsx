import {useLocalSettings} from '@/stores/localSettings'
import List from './Lists/List'
import {useEffect, useState} from 'react'
import ListItem from './Lists/ListItem'
import {getEntries} from '@/data/queries'
import {toMoney} from '@/utils/helpers'
import {PADDING} from '@/constants/Styles'
import ListItemSkeleton from './Lists/ListItemSkeleton'
import dayjs from 'dayjs'
import {ThemedText} from './ThemedText'
import {ThemedView} from './ThemedView'
import {BlurView} from 'expo-blur'
import {Colors} from '@/constants/Colors'

export interface Category {
  id: string
  name: string
}

export interface SubCategory {
  id: string
  name: string
  categories?: Category
}

export interface Entry {
  id: string
  amount: number
  created_at: string
  categories: Category
  sub_categories: SubCategory
}

export default function RecentEntries({counter}: {counter: number}) {
  const {defaultBudget} = useLocalSettings()
  const [entries, setEntries] = useState<any>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    const load = async () => {
      setRefreshing(true)
      if (!defaultBudget) return
      const nextData = await getEntries(defaultBudget?.id)

      console.log('nextData', nextData)
      setEntries(nextData)

      setLoading(false)
      // await new Promise((res, rej) => setTimeout(res, 2000))
      setRefreshing(false)
    }

    load()
  }, [defaultBudget, counter])

  return refreshing ? (
    <List style={{marginBottom: PADDING, zIndex: 2}}>
      {[...Array(entries.length || 5).keys()].map((v: number, i: number) => {
        return <ListItemSkeleton key={v} lastItem={i === entries.length - 1} />
      })}
    </List>
  ) : (
    <List style={{marginBottom: PADDING, zIndex: 2}}>
      <BlurView
        intensity={50}
        style={{
          paddingLeft: PADDING / 2 + 5,
          paddingVertical: 3,
        }}
      >
        <ThemedText
          style={{
            opacity: 0.4,
            fontWeight: 'bold',
            fontSize: 12,
          }}
        >
          Recent entries
        </ThemedText>
      </BlurView>
      {entries.map((entry: Entry, i: number) => {
        return (
          <ListItem
            key={entry.id}
            lastItem={i === entries.length - 1}
            title={entry.sub_categories.name}
            description={dayjs(entry.created_at).format('HH:mm - ddd D MMM')}
            category={entry.categories}
            // description={entry.categories.name}
            right={toMoney(entry.amount)}
          />
        )
      })}
    </List>
  )
}
