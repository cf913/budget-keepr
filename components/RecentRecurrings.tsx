import { PADDING, TYPO } from '@/constants/Styles'
import { Recurring, getRecurrings } from '@/data/recurring'
import { useThemeColor } from '@/hooks/useThemeColor'
import { useLocalSettings } from '@/stores/localSettings'
import { useQuery } from '@tanstack/react-query'
import { BlurView } from 'expo-blur'
import { ScrollView } from 'react-native-gesture-handler'
import Padder from './Layout/Padder'
import List from './Lists/List'
import ListItemRecurring from './Lists/ListItemRecurring'
import ListItemSkeleton from './Lists/ListItemSkeleton'
import { ThemedText } from './ThemedText'

export default function RecentRecurrings() {
  const textColor = useThemeColor({}, 'text')

  const {
    data: recurrings = [],
    error,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['recurrings'],
    queryFn: () => getRecurrings(undefined, {}, 2),
  })

  // TODO: error handling
  if (error) alert(error.message)

  return isLoading || isRefetching ? (
    <List style={{ marginBottom: PADDING, zIndex: 2 }}>
      {[...Array(recurrings?.length || 5).keys()].map(
        (v: number, i: number) => {
          return (
            <ListItemSkeleton
              key={v}
              lastItem={i === (recurrings || []).length - 1}
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
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{}}
        contentContainerStyle={{}}
      >
        <Padder style={{ height: PADDING / 2 + 20 }} />
        {(recurrings || []).map((recurring: Recurring, i: number) => {
          return (
            <ListItemRecurring
              key={recurring.id}
              lastItem={i === (recurrings || []).length - 1}
              recurring={recurring}
              onDelete={() => alert('Delete recurring')}
              onUpdate={() => alert('Update recurring')}
              enabled={false}
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
          {(recurrings || []).length
            ? 'Next Recurring Payments'
            : ' 0 Recurring Payments. Congrats! 🎉'}
        </ThemedText>
      </BlurView>
    </List>
  )
}
