import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { Slot, useNavigationContainerRef } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import React, { useEffect } from 'react'
import 'react-native-reanimated'

import { useColorScheme } from '@/hooks/useColorScheme'
import { SessionProvider } from '@/stores/session'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { LocalSettingsProvider } from '@/stores/localSettings'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/tanstack'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import * as Sentry from '@sentry/react-native'
import { isRunningInExpoGo } from 'expo'
import { TempStoreProvider } from '@/stores/tempStore'
import { Toasts } from '@backpackapp-io/react-native-toast'
import Toasty from '@/lib/Toasty'

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

const routingInstrumentation = new Sentry.ReactNavigationInstrumentation()

Sentry.init({
  dsn: 'https://0e4a09904690ab71879056856f657591@o4507417582764032.ingest.us.sentry.io/4507417584664576',

  // debug: __DEV__,
  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // enableSpotlight: __DEV__,
  integrations: [
    new Sentry.ReactNativeTracing({
      // Pass instrumentation to be used as `routingInstrumentation`
      routingInstrumentation,

      enableNativeFramesTracking: !isRunningInExpoGo(),
      // ...
    }),
  ],
})

function RootLayout() {
  const colorScheme = useColorScheme()
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  })

  const ref = useNavigationContainerRef()

  useEffect(() => {
    if (ref) {
      routingInstrumentation.registerNavigationContainer(ref)
    }
  }, [ref])

  useEffect(() => {
    if (loaded) {
      // SplashScreen.hideAsync()
      Toasty.success('App ready!')
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
              <TempStoreProvider>
                <QueryClientProvider client={queryClient}>
                  <Slot />
                  <Toasts />
                </QueryClientProvider>
              </TempStoreProvider>
            </LocalSettingsProvider>
          </SessionProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}

export default Sentry.wrap(RootLayout)
