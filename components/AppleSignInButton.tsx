import {Platform, useColorScheme} from 'react-native'
import * as AppleAuthentication from 'expo-apple-authentication'
import {supabase} from '@/lib/supabase'

const HEIGHT = 48

export function AppleSignInButton({setLoading}: {setLoading: (value: boolean) => void}) {
  const theme = useColorScheme() ?? 'light'
  if (Platform.OS === 'ios')
    return (
      <AppleAuthentication.AppleAuthenticationButton
        buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
        buttonStyle={
          theme === 'light'
            ? AppleAuthentication.AppleAuthenticationButtonStyle.BLACK
            : AppleAuthentication.AppleAuthenticationButtonStyle.WHITE
        }
        cornerRadius={8}
        style={{width: '100%', height: HEIGHT}}
        onPress={async () => {
          try {
            const credential = await AppleAuthentication.signInAsync({
              requestedScopes: [
                AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                AppleAuthentication.AppleAuthenticationScope.EMAIL,
              ],
            })
            setLoading(true)
            // Sign in via Supabase Auth.
            if (credential.identityToken) {
              const {
                error,
                data: {user},
              } = await supabase.auth.signInWithIdToken({
                provider: 'apple',
                token: credential.identityToken,
              })
              console.log(JSON.stringify({error, user}, null, 2))
              if (!error) {
                // User is signed in.
                // SessionProvider takes over from here and saves the session
              }
            } else {
              setLoading(false)
              throw new Error('No identityToken.')
            }
          } catch (e) {
            if (e.code === 'ERR_REQUEST_CANCELED') {
              // handle that the user canceled the sign-in flow
            } else {
              // handle other errors
            }
          }
        }}
      />
    )
  return <>{/* Implement Android Auth options. */}</>
}
