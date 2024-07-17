import React, { createContext, useContext, useEffect } from 'react'
import { View, ActivityIndicator } from 'react-native'
import { User } from '@supabase/supabase-js'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase' // Adjust this import based on your Supabase client location
import { ThemedText } from '@/components/ThemedText'
import { useColors } from '@/hooks/useColors'
import { getSupabaseUser } from '@/data/api'
import Toasty from '@/lib/Toasty'

// Create a context for the user
const UserContext = createContext<{
  user?: User | null
  isLoading: boolean
  error: Error | null
  refetch: () => void
}>({
  user: null,
  isLoading: true,
  error: null,
  refetch: () => { },
})

// Custom hook to use the user context
export const useUser = () => useContext(UserContext)

type WithUserProps = {
  children:
  | React.ReactNode
  | ((props: {
    user?: User | null
    isLoading: boolean
    error: Error | null
    refetch: () => void
  }) => React.ReactNode)
}

function UserProvider({ children }: WithUserProps) {
  const { textColor } = useColors()
  const queryClient = useQueryClient()
  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['user'],
    queryFn: getSupabaseUser,
    staleTime: Infinity, // The user data doesn't change often, so we can cache it indefinitely
    retry: false, // Don't retry on failure
  })

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
          queryClient.invalidateQueries({ queryKey: ['user'] })
        }
      },
    )

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={textColor} />
      </View>
    )
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ThemedText>Error: {error.message}</ThemedText>
      </View>
    )
  }

  if (user?.user_metadata?.username) {
    Toasty.success(`Welcome back, ${user.user_metadata.username}!`)
  } else {
    Toasty.success('Bonjour!')
  }

  const contextValue = { user, isLoading, error, refetch }

  return (
    <UserContext.Provider value={contextValue}>
      {typeof children === 'function' ? children(contextValue) : children}
    </UserContext.Provider>
  )
}

export function WithUser({ children }: WithUserProps) {
  return <UserProvider>{children}</UserProvider>
}
