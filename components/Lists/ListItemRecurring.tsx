import { RecurringUpdateType } from '@/app/(app)/settings/recurring'
import { Recurring, RecurringUpdateInput } from '@/data/recurring'
import { useThemeColor } from '@/hooks/useThemeColor'
import { Feather } from '@expo/vector-icons'
import dayjs from 'dayjs'
import { useMemo } from 'react'
import { Animated } from 'react-native'
import { RectButton, Swipeable } from 'react-native-gesture-handler'
import ListItem from './ListItem'

interface ListItemRecurringProps {
  recurring: Recurring
  lastItem: boolean
  onDelete: (id: string) => void
  onUpdate: (
    recurringType: RecurringUpdateType,
    recurring: RecurringUpdateInput,
  ) => void
}

export default function ListItemRecurring(props: ListItemRecurringProps) {
  const { recurring, lastItem, onDelete, onUpdate } = props

  const bgColor = useThemeColor({}, 'bg_secondary')
  const bgColor2 = useThemeColor({}, 'bg')
  const tintColor = useThemeColor({}, 'tint')

  const listItemDescription = useMemo(() => {
    const now = dayjs()

    const isExpiring =
      !recurring.active &&
      (now.isSame(recurring.next_at, 'day') || now.isBefore(recurring.next_at))
    const isExpired = recurring.active && now.isAfter(recurring.next_at, 'day')

    const verb = isExpiring ? 'Expires' : isExpired ? 'Expired on' : 'Renews'

    return `${verb} ${dayjs(recurring.next_at).format('ddd D MMM YYYY')}`
  }, [recurring])

  return (
    <Swipeable
      key={recurring.id}
      containerStyle={{ backgroundColor: bgColor }}
      renderLeftActions={() => (
        <>
          <RectButton
            style={[
              {},
              {
                width: 50,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: bgColor2,
              },
            ]}
            onPress={() =>
              onUpdate('active', {
                id: recurring.id,
                active: !recurring.active,
              })
            }
          >
            <Animated.Text style={[{}]}>
              <Feather
                name={recurring.active ? 'pause' : 'play'}
                size={24}
                color={tintColor}
              />
            </Animated.Text>
          </RectButton>
          <RectButton
            style={[
              {},
              {
                width: 50,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: bgColor2,
              },
            ]}
            onPress={() =>
              onUpdate('archived', {
                id: recurring.id,
                archived: !recurring.archived,
              })
            }
          >
            <Animated.Text style={[{}]}>
              <Feather
                name={recurring.archived ? 'sun' : 'archive'}
                size={21}
                color={'white'}
              />
            </Animated.Text>
          </RectButton>
        </>
      )}
      renderRightActions={() => (
        <RectButton
          style={[
            {},
            {
              width: 70,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: bgColor,
            },
          ]}
          onPress={() => onDelete(recurring.id)}
        >
          <Animated.Text
            style={[
              // styles.actionText,
              {
                // transform: [{translateX: trans}],
              },
            ]}
          >
            <Feather name="trash-2" size={24} color={'red'} />
          </Animated.Text>
        </RectButton>
      )}
    >
      <ListItem
        title={recurring.sub_category.name}
        right={recurring.active ? 'Active' : 'Inactive'}
        rightColorOverride={recurring.active ? '' : 'gray'}
        key={recurring.id}
        lastItem={lastItem}
        description={listItemDescription}
      />
    </Swipeable>
  )
}
