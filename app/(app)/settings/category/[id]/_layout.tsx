import {Stack} from 'expo-router'

export default function CategoryLayout() {
  return (
    <Stack screenOptions={{headerShown: false}}>
      <Stack.Screen
        name="[id]/create"
        options={{
          // Hide the header for all other routes.
          presentation: 'modal',
        }}
      />
    </Stack>
  )
}
