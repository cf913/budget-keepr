import {DarkTheme, DefaultTheme, ThemeProvider} from '@react-navigation/native'
import {useFonts} from 'expo-font'
import {Slot} from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import {useEffect} from 'react'
import 'react-native-reanimated'

import {useColorScheme} from '@/hooks/useColorScheme'
import {SessionProvider} from '@/stores/session'
import {SafeAreaProvider} from 'react-native-safe-area-context'
import {LocalSettingsProvider} from '@/stores/localSettings'
import {QueryClientProvider} from '@tanstack/react-query'
import {queryClient} from '@/lib/tanstack'
import {GestureHandlerRootView} from 'react-native-gesture-handler'

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const colorScheme = useColorScheme()
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  })

  useEffect(() => {
    if (loaded) {
      // SplashScreen.hideAsync()
    }
  }, [loaded])

  if (!loaded) {
    return null
  }

  return (
    <GestureHandlerRootView>
      <SafeAreaProvider>
        <ThemeProvider
          value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
        >
          <SessionProvider>
            <LocalSettingsProvider>
              <QueryClientProvider client={queryClient}>
                <Slot />
              </QueryClientProvider>
            </LocalSettingsProvider>
          </SessionProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}
