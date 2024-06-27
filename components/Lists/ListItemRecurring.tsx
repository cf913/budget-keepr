import { Recurring } from '@/data/recurring'
import { useThemeColor } from '@/hooks/useThemeColor'
import { Feather } from '@expo/vector-icons'
import dayjs from 'dayjs'
import { Animated } from 'react-native'
import { RectButton, Swipeable } from 'react-native-gesture-handler'
import ListItem from './ListItem'

interface ListItemRecurringProps {
  recurring: Recurring
  lastItem: boolean
  onDelete: (id: string) => void
  onToggleActive: (id: string, active: boolean) => void
}

export default function ListItemRecurring(props: ListItemRecurringProps) {
  const { recurring, lastItem, onDelete, onToggleActive } = props

  const bgColor = useThemeColor({}, 'bg_secondary')
  const tintColor = useThemeColor({}, 'tint')

  return (
    <Swipeable
      key={recurring.id}
      containerStyle={{ backgroundColor: bgColor }}
      renderLeftActions={() => (
        <RectButton
          style={[
            {},
            {
              width: 50,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: bgColor,
            },
          ]}
          onPress={() => onToggleActive(recurring.id, recurring.active)}
        >
          <Animated.Text style={[{}]}>
            <Feather
              name={recurring.active ? 'pause' : 'play'}
              size={24}
              color={tintColor}
            />
          </Animated.Text>
        </RectButton>
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
        key={recurring.id}
        lastItem={lastItem}
        description={`Renews ${dayjs(recurring.next_at).format(
          'ddd D MMM YYYY',
        )}`}
      />
    </Swipeable>
  )
}
