import {Feather} from '@expo/vector-icons'
import {Link} from 'expo-router'
import {Pressable} from 'react-native'
import {useThemeColor} from '@/hooks/useThemeColor'

export default function SettingsButton() {
  const iconColor = useThemeColor({}, 'tint')
  return (
    <Link href="/settings" asChild>
      <Pressable>
        <Feather name="settings" size={24} color={iconColor} />
      </Pressable>
    </Link>
  )
}
