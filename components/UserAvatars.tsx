import { Member } from '@/stores/localSettings'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import LazyImage from './Images/LazyImage'
import { useColors } from '@/hooks/useColors'

interface UserAvatarsProps {
  members: Member[]
  maxDisplayed?: number
}

const UserAvatars: React.FC<UserAvatarsProps> = ({
  members,
  maxDisplayed = 5,
}) => {
  const { textColor } = useColors()
  const displayUsers = members.slice(0, maxDisplayed).reverse()

  return (
    <View style={styles.container}>
      {displayUsers.map(({ user }, index) => (
        <View
          key={user.id}
          style={[
            styles.avatarContainer,
            { borderColor: textColor },
            { zIndex: index + 1, marginLeft: index * -10 },
          ]}
        >
          <LazyImage source={{ uri: user.avatar_url }} style={styles.avatar} />
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
})

export default UserAvatars
