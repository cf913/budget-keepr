import {ThemedText} from '@/components/ThemedText'
import {ThemedView} from '@/components/ThemedView'
import {supabase} from '@/lib/supabase'
import {Pressable} from 'react-native'

export default function Settings() {
  return (
    <ThemedView>
      <ThemedText>TODO: Settings Screen</ThemedText>
      <Pressable onPress={() => supabase.auth.signOut()}>
        <ThemedText>Sign Out</ThemedText>
      </Pressable>
    </ThemedView>
  )
}
