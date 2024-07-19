import { Stack } from 'expo-router'

export default function SettingsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="category-create"
        options={{
          headerShown: false,
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="category/[id]/edit"
        options={{
          // Set the presentation mode to modal for our modal route.
          presentation: 'modal',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="category/[id]/create"
        options={{
          // Set the presentation mode to modal for our modal route.
          presentation: 'modal',
          headerShown: false,
        }}
      />
    </Stack>
  )
}
