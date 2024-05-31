import {Link} from 'expo-router'
import {Pressable} from 'react-native'
import {ThemedText} from '../ThemedText'

export default function SettingsButton() {
  return (
    <Link href="settings" asChild>
      <Pressable>
        <ThemedText>Settings</ThemedText>
      </Pressable>
    </Link>
  )
}
