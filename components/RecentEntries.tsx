import {useLocalSettings} from '@/stores/localSettings'
import List from './Lists/List'
import {useEffect} from 'react'
import ListItem from './Lists/ListItem'
import {getEntries} from '@/data/queries'
import {toMoney} from '@/utils/helpers'
import {HEIGHT, PADDING, STYLES} from '@/constants/Styles'
import ListItemSkeleton from './Lists/ListItemSkeleton'
import dayjs from 'dayjs'
import {ThemedText} from './ThemedText'
import {BlurView} from 'expo-blur'
import Swipeable from 'react-native-gesture-handler/Swipeable'
import {RectButton, ScrollView} from 'react-native-gesture-handler'
import {Animated} from 'react-native'
import {Feather} from '@expo/vector-icons'
import {useMutation, useQuery} from '@tanstack/react-query'
import {deleteEntry} from '@/data/entries'
import {queryClient} from '@/lib/tanstack'
import {AnalyticsQueryKeys} from './Analytics'
import {useThemeColor} from '@/hooks/useThemeColor'

export interface Category {
  id: string
  name: string
  color: string
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

export default function RecentEntries({
  counter,
  setCounter,
}: {
  counter: number
  setCounter: (value: number) => void
}) {
  const {defaultBudget} = useLocalSettings()
  const textColor = useThemeColor({}, 'mid')

  const mult = (arr: any[]) => {
    let newArr: any = []
    for (let i = 0; i < 15; i++) {
      newArr = newArr.concat(arr)
    }
    return newArr
  }
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
  }, [refetch, counter])

  const mutation = useMutation({
    mutationFn: (entryId: string) => deleteEntry(entryId),
    // onMutate(variables) {

    // },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['entries', ...AnalyticsQueryKeys],
      })
      setCounter(counter + 1)
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
      <ScrollView style={{maxHeight: 5 * HEIGHT.item}}>
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
                description={dayjs(entry.created_at).format(
                  'HH:mm - ddd D MMM',
                )}
                category={entry.categories}
                // description={entry.categories.name}
                right={toMoney(entry.amount)}
              />
            </Swipeable>
          )
        })}
      </ScrollView>
    </List>
  )
}
