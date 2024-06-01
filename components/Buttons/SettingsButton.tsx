import {Feather} from '@expo/vector-icons'
import {Link} from 'expo-router'
import {Pressable} from 'react-native'
import {useThemeColor} from '@/hooks/useThemeColor'

export default function SettingsButton() {
  const iconColor = useThemeColor({}, 'mid')
  return (
    <Link href="/settings" asChild>
      <Pressable hitSlop={30} style={{zIndex: 2}}>
        <Feather name="settings" size={24} color={iconColor} />
      </Pressable>
    </Link>
  )
}
