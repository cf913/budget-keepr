import { supabase } from '@/lib/supabase'
import { Session } from '@supabase/supabase-js'
import React, { useEffect, useState } from 'react'

const AuthContext = React.createContext<{
  setSession: (session: Session | null) => void
  session?: Session | null
  isLoading: boolean
}>({
  setSession: () => null,
  session: null,
  isLoading: true,
})

export function useSession() {
  const value = React.useContext(AuthContext)
  if (process.env.NODE_ENV !== 'production') {
    if (!value) {
      throw new Error('useSession must be wrapped in a <SessionProvider />')
    }
  }

  return value
}

export function SessionProvider(props: React.PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    console.log('session')
    // fetch session from AsyncStorage on initial load
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('found a seession?', session)
      if (session) {
        setSession(session)
      } else {
        console.log('no user')
        setSession(null)
      }
      if (isLoading) setLoading(false)
    })

    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('event', event)
      console.log('session', session)
      if (!session) return
      console.log('here')

      if (event === 'INITIAL_SESSION') {
        // handle initial session
        console.log('sessiong found', session)
        setSession(session)
      } else if (event === 'SIGNED_IN') {
        // handle sign in event
        setSession(session)
      } else if (event === 'SIGNED_OUT') {
        // handle sign out event
        setSession(null)
      } else if (event === 'PASSWORD_RECOVERY') {
        // handle password recovery event
      } else if (event === 'TOKEN_REFRESHED') {
        // handle token refreshed event
      } else if (event === 'USER_UPDATED') {
        // handle user updated event
      }
    })

    // call unsubscribe to remove the callback
    return () => data.subscription.unsubscribe()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        setSession,
        session,
        isLoading,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  )
}
