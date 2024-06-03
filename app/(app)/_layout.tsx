import {useSession} from '@/stores/session'
import {Redirect, Stack} from 'expo-router'
import {Text} from 'react-native'

export default function AppLayout() {
  const {isLoading, session} = useSession()

  if (isLoading) return <Text>Loading Session...</Text>

  if (!session) return <Redirect href="/sign-in" />

  return (
    <Stack
      screenOptions={{headerTransparent: true, headerBlurEffect: 'regular'}}
    >
      <Stack.Screen
        name="select-budget-onboarding"
        options={{title: 'Select Budget'}}
      />
      <Stack.Screen name="(main)" options={{headerShown: false}} />
      <Stack.Screen name="+not-found" />
      <Stack.Screen
        name="settings"
        options={{
          title: 'Settings',
          headerShown: false,
        }}
      />
    </Stack>
  )
}
