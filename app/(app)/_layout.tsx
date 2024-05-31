import SettingsButton from '@/components/Buttons/SettingsButton'
import {useSession} from '@/stores/session'
import {Redirect, Stack} from 'expo-router'
import {Text} from 'react-native'

export default function AppLayout() {
  const {isLoading, session} = useSession()

  if (isLoading) return <Text>Loading Session...</Text>

  if (!session) return <Redirect href="/sign-in" />

  return (
    <Stack initialRouteName="select-budget">
      <Stack.Screen
        name="select-budget"
        options={{title: 'Select Budget', headerRight: SettingsButton}}
      />
      <Stack.Screen name="(tabs)" options={{headerShown: false}} />
      <Stack.Screen name="+not-found" />
      <Stack.Screen name="settings" options={{headerShown: false}} />
    </Stack>
  )
}
