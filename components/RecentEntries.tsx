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
import Swipeable from 'react-native-gesture-handler/Swipeable'
import {
  GestureDetector,
  GestureHandlerRootView,
  RectButton,
} from 'react-native-gesture-handler'
import {Animated} from 'react-native'
import {Feather} from '@expo/vector-icons'
import {useMutation, useQuery} from '@tanstack/react-query'
import {deleteEntry} from '@/data/entries'
import {queryClient} from '@/lib/tanstack'
import {AnalyticsQueryKeys} from './Analytics'
import {useTheme} from '@react-navigation/native'
import {useThemeColor} from '@/hooks/useThemeColor'

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
  // const [entries, setEntries] = useState<any>([])
  const [loading, setLoading] = useState(true)
  // const [refreshing, setRefreshing] = useState(false)
  const textColor = useThemeColor({}, 'mid')

  const {
    data: entries = [],
    error,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['entries'],
    queryFn: () => getEntries(defaultBudget?.id),
  })

  useEffect(() => {
    refetch()
  }, [defaultBudget, counter])

  const mutation = useMutation({
    mutationFn: (entryId: string) => deleteEntry(entryId),
    // onMutate(variables) {

    // },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['entries', ...AnalyticsQueryKeys],
      })
      refetch()
    },
    onError: error => {
      console.log('error', error.message)
      alert('Oops. ' + error.message)
    },
  })

  if (error) alert(error.message)

  return isLoading || isRefetching ? (
    <List style={{marginBottom: PADDING, zIndex: 2}}>
      {[...Array(entries?.length || 5).keys()].map((v: number, i: number) => {
        return (
          <ListItemSkeleton
            key={v}
            lastItem={i === (entries || []).length - 1}
          />
        )
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
            fontWeight: 'bold',
            fontSize: 12,
            color: textColor,
          }}
        >
          Recent entries
        </ThemedText>
      </BlurView>
      {(entries || []).map((entry: Entry, i: number) => {
        return (
          <Swipeable
            key={entry.id}
            containerStyle={{backgroundColor: 'red'}}
            renderRightActions={() => (
              <RectButton
                style={[
                  {},
                  // styles.leftAction
                  {
                    width: 50,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'red',
                  },
                ]}
                onPress={() => mutation.mutate(entry.id)}
              >
                <Animated.Text
                  style={[
                    // styles.actionText,
                    {
                      // transform: [{translateX: trans}],
                    },
                  ]}
                >
                  <Feather name="trash-2" size={24} color={'white'} />
                </Animated.Text>
              </RectButton>
            )}
          >
            <ListItem
              lastItem={i === (entries || []).length - 1}
              title={entry.sub_categories?.name}
              description={dayjs(entry.created_at).format('HH:mm - ddd D MMM')}
              category={entry.categories}
              // description={entry.categories.name}
              right={toMoney(entry.amount)}
            />
          </Swipeable>
        )
      })}
    </List>
  )
}
