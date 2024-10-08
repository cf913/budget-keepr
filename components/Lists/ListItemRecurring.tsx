import { Recurring, RecurringUpdateInput } from '@/data/recurring'
import { useThemeColor } from '@/hooks/useThemeColor'
import { Feather } from '@expo/vector-icons'
import dayjs from 'dayjs'
import { useMemo, useRef } from 'react'
import { Animated } from 'react-native'
import { RectButton, Swipeable } from 'react-native-gesture-handler'
import ListItem from './ListItem'
import { toMoney } from '@/utils/helpers'
import { router } from 'expo-router'
import { RecurringUpdateType } from '@/app/(app)/(main)/recurrings'

interface ListItemRecurringProps {
  recurring: Recurring
  href?: string
  lastItem: boolean
  onDelete: (id: string) => void
  onUpdate: (
    recurringType: RecurringUpdateType,
    recurring: RecurringUpdateInput,
  ) => void
  enabled?: boolean
}

export default function ListItemRecurring(props: ListItemRecurringProps) {
  const ref = useRef<Swipeable>(null)
  const { recurring, lastItem, onUpdate, enabled = true, href } = props

  const bgColor = useThemeColor({}, 'bg_secondary')
  const tintColor = useThemeColor({}, 'tint')

  const [isExpired, listItemRight, listItemDescription] = useMemo(() => {
    const now = dayjs()

    const isExpiring = !recurring.active && now.isBefore(recurring.next_at)
    const isExpired =
      !recurring.active &&
      (now.isSame(recurring.next_at, 'day') ||
        now.isAfter(recurring.next_at, 'day'))

    const verb = isExpired ? 'Expired on' : isExpiring ? 'Expires' : 'Renews'

    const listItemRight = toMoney(recurring.amount)

    return [
      isExpired,
      listItemRight,
      `${verb} ${dayjs(recurring.next_at).format('ddd D MMM YYYY')}`,
    ]
  }, [recurring])

  const onUpdateActive = () => {
    onUpdate('active', {
      id: recurring.id,
      active: !recurring.active,
    })
    ref.current?.close()
  }

  const onUpdateArchived = () => {
    onUpdate('archived', {
      id: recurring.id,
      archived: !recurring.archived,
    })
    ref.current?.close()
  }

  const onEdit = () => {
    router.navigate(`/(main)/recurrings/${recurring.id}`)
  }

  return (
    <Swipeable
      ref={ref}
      key={recurring.id}
      enabled={enabled}
      containerStyle={{ backgroundColor: bgColor }}
      renderRightActions={() =>
        isExpired && recurring.archived ? null : (
          <>
            {/* EDIT BUTTON */}
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
              onPress={onEdit}
            >
              <Animated.Text style={[{}]}>
                <Feather name={'edit'} size={21} color={'white'} />
              </Animated.Text>
            </RectButton>
            {!isExpired ? (
              // ACTIVE BUTTON
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
                onPress={onUpdateActive}
              >
                <Animated.Text style={[{}]}>
                  <Feather
                    name={recurring.active ? 'pause' : 'play'}
                    size={24}
                    color={tintColor}
                  />
                </Animated.Text>
              </RectButton>
            ) : null}
            {/* ARCHIVE BUTTON */}
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
              onPress={onUpdateArchived}
            >
              <Animated.Text style={[{}]}>
                <Feather
                  name={recurring.archived ? 'arrow-up' : 'archive'}
                  size={21}
                  color={'white'}
                />
              </Animated.Text>
            </RectButton>
          </>
        )
      }
    >
      <ListItem
        title={recurring.sub_category.name}
        href={href}
        showHrefIcon={false}
        right={listItemRight}
        rightColorOverride={recurring.active ? '' : 'gray'}
        key={recurring.id}
        lastItem={lastItem}
        description={listItemDescription}
        category={recurring.category}
      />
    </Swipeable>
  )
}
