import { PADDING, TYPO } from '@/constants/Styles'
import { getEntries } from '@/data/entries'
import { useThemeColor } from '@/hooks/useThemeColor'
import Toasty from '@/lib/Toasty'
import { useLocalSettings } from '@/stores/localSettings'
import { toMoney } from '@/utils/helpers'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { BlurView } from 'expo-blur'
import { useEffect } from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import { Padder } from './Layout'
import List from './Lists/List'
import ListItem from './Lists/ListItem'
import ListItemSkeleton from './Lists/ListItemSkeleton'
import { ThemedText } from './ThemedText'

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
  } = useQuery({
    queryKey: ['recent_entries', defaultBudget?.id],
    queryFn: () => getEntries(defaultBudget?.id, { limit: 3, offset: 0 }),
    refetchOnWindowFocus: true,
  })

  useEffect(() => {
    refetch()
  }, [refetch, counter])

  if (error) Toasty.error('RecentEntries: ' + error.message)

  return !entries && isLoading ? (
    <List style={{ marginBottom: PADDING, zIndex: 2 }}>
      {[...Array(3).keys()].map((v: number, i: number) => {
        return <ListItemSkeleton key={v} lastItem={i === 3 - 1} />
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
              showHrefIcon={false}
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
