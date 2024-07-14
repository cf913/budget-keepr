import { Stack } from 'expo-router'

export default function SettingsLayout() {
  // return <Slot />
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="index"
        options={{
          // Hide the header for all other routes.
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="add-new-entry"
        options={{
          // Set the presentation mode to modal for our modal route.
          presentation: 'modal',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="new-category"
        options={{
          // Set the presentation mode to modal for our modal route.
          presentation: 'modal',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="select-frequency"
        options={{
          // Set the presentation mode to modal for our modal route.
          presentation: 'modal',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="select-category"
        options={{
          // Set the presentation mode to modal for our modal route.
          presentation: 'modal',
          headerShown: false,
        }}
      />
    </Stack>
  )
}
