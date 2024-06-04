import {Stack} from 'expo-router'

export default function CategoryLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="[id]/create"
        options={{
          // Hide the header for all other routes.
          headerShown: false,
          presentation: 'modal',
        }}
      />
    </Stack>
  )
}
