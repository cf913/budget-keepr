import { useLocalSettings } from '@/stores/localSettings'
import List from './Lists/List'
import { useEffect } from 'react'
import ListItem from './Lists/ListItem'
import { getEntries } from '@/data/queries'
import { toMoney } from '@/utils/helpers'
import { HEIGHT, PADDING, STYLES, TYPO } from '@/constants/Styles'
import ListItemSkeleton from './Lists/ListItemSkeleton'
import dayjs from 'dayjs'
import { ThemedText } from './ThemedText'
import { BlurView } from 'expo-blur'
import Swipeable from 'react-native-gesture-handler/Swipeable'
import { RectButton, ScrollView } from 'react-native-gesture-handler'
import { Alert, Animated, useWindowDimensions } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { useMutation, useQuery } from '@tanstack/react-query'
import { deleteEntry } from '@/data/entries'
import { queryClient } from '@/lib/tanstack'
import { AnalyticsQueryKeys } from './Analytics'
import { useThemeColor } from '@/hooks/useThemeColor'
import { ThemedView } from './ThemedView'
import Padder from './Layout/Padder'

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
  sub_categories: SubCategory
}

export default function RecentEntries({
  counter,
  setCounter,
}: {
  counter: number
  setCounter: (value: number) => void
}) {
  const { defaultBudget } = useLocalSettings()
  const textColor = useThemeColor({}, 'mid')
  const { height } = useWindowDimensions()

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

  const onDelete = async (id: string) => {
    Alert.alert('Confirm delete?', 'This action cannot be undone.', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'Delete',
        onPress: () => mutation.mutate(id),
        style: 'destructive',
      },
    ])
  }

  return isLoading || isRefetching ? (
    <List style={{ marginBottom: PADDING, zIndex: 2 }}>
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
    <List
      style={{
        // marginBottom: PADDING,
        zIndex: 2,
        position: 'relative',
      }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={
          {
            // maxHeight: height * 0.5,
            // flex: 1,
          }
        }
        contentContainerStyle={
          {
            // flex: 1,
          }
        }
      >
        <Padder style={{ height: PADDING / 2 + 20 }} />
        {(entries || []).map((entry: Entry, i: number) => {
          return (
            <Swipeable
              key={entry.id}
              containerStyle={{ backgroundColor: 'red' }}
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
                  onPress={() => onDelete(entry.id)}
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
                category={entry.category}
                // description={entry.categories.name}
                right={toMoney(entry.amount)}
              />
            </Swipeable>
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
