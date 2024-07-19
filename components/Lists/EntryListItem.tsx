import React from 'react'
import { Animated } from 'react-native'
import { RectButton, Swipeable } from 'react-native-gesture-handler'
import { Feather } from '@expo/vector-icons'
import dayjs from 'dayjs'

import ListItem from '@/components/Lists/ListItem'
import { RADIUS } from '@/constants/Styles'
import { useThemeColor } from '@/hooks/useThemeColor'
import { toMoney } from '@/utils/helpers'
import { Entry } from '@/components/RecentEntries'

interface EntryListItemProps {
  item: Entry
  index: number
  totalItems: number
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  backgroundColor: string
}

const EntryListItem: React.FC<EntryListItemProps> = ({
  item,
  index,
  totalItems,
  onEdit,
  onDelete,
  backgroundColor,
}) => {
  const textColor = useThemeColor({}, 'text')

  return (
    <Swipeable
      containerStyle={[
        { backgroundColor },
        index === 0 && {
          borderTopLeftRadius: RADIUS,
          borderTopRightRadius: RADIUS,
        },
        index === totalItems - 1 && {
          borderBottomLeftRadius: RADIUS,
          borderBottomRightRadius: RADIUS,
        },
      ]}
      renderRightActions={() => (
        <>
          <RectButton
            style={{
              width: 50,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor,
            }}
            onPress={() => onEdit(item.id)}
          >
            <Animated.Text>
              <Feather name="edit" size={24} color={textColor} />
            </Animated.Text>
          </RectButton>
          <RectButton
            style={{
              width: 50,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor,
            }}
            onPress={() => onDelete(item.id)}
          >
            <Animated.Text>
              <Feather name="trash-2" size={24} color="red" />
            </Animated.Text>
          </RectButton>
        </>
      )}
    >
      <ListItem
        firstItem={index === 0}
        lastItem={index === totalItems - 1}
        showHrefIcon={false}
        title={item.sub_category?.name}
        description={dayjs(item.created_at).format('HH:mm - ddd D MMM')}
        category={item.category}
        right={toMoney(item.amount)}
      />
    </Swipeable>
  )
}

export default React.memo(EntryListItem)
