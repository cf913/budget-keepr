import { AppleSignInButton } from '@/components/AppleSignInButton'
import { Divider } from '@/components/Divider'
import { Padder } from '@/components/Layout'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { Colors } from '@/constants/Colors'
import { TYPO } from '@/constants/Styles'
import { VERSION } from '@/constants/config'
import { supabase } from '@/lib/supabase'
import { useSession } from '@/stores/session'
import { Redirect } from 'expo-router'
import React, { useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  Button,
  TextInput as Input,
  StyleSheet,
  useColorScheme,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function Auth() {
  const insets = useSafeAreaInsets()
  const theme = useColorScheme() ?? 'light'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { session } = useSession()

  if (session) return <Redirect href="/(main)" />

  async function signInWithEmail() {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    if (error) {
      Alert.alert('Auth error: ' + error.message)
    }
    setLoading(false)
  }

  async function signUpWithEmail() {
    setLoading(true)
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    })

    if (error) Alert.alert(error.message)
    if (!session) Alert.alert('Please check your inbox for email verification!')
    setLoading(false)
  }

  const inputStyles = [
    styles.input,
    { borderColor: Colors[theme].gray, color: Colors[theme].text },
  ]

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <ThemedView style={[styles.verticallySpaced, styles.mt20]}>
        <Input
          onChangeText={text => setEmail(text)}
          value={email}
          placeholder="email@address.com"
          autoCapitalize={'none'}
          style={inputStyles}
        />
      </ThemedView>
      <ThemedView style={styles.verticallySpaced}>
        <Input
          onChangeText={text => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize={'none'}
          style={inputStyles}
        />
      </ThemedView>
      <ThemedView style={[styles.verticallySpaced, styles.mt20]}>
        <Button
          title="Sign in"
          disabled={loading}
          onPress={() => signInWithEmail()}
        />
      </ThemedView>
      <ThemedView style={styles.verticallySpaced}>
        <Button
          title="Sign up"
          disabled={loading}
          onPress={() => signUpWithEmail()}
        />
      </ThemedView>
      <Padder />
      <Divider />
      <Padder />
      {loading ? (
        <ThemedView
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            height: 48,
            width: '100%',
          }}
        >
          <ActivityIndicator size="large" color={Colors[theme].gray} />
        </ThemedView>
      ) : (
        <AppleSignInButton {...{ setLoading }} />
      )}
      <Padder />
      <ThemedText style={{ ...TYPO.small }}>
        {`${VERSION} ${process.env.EXPO_PUBLIC_SUPABASE_URL}`}
      </ThemedText>
      <ThemedText style={{ ...TYPO.small }}>
        {`key ${process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY?.slice(-5)}`}
      </ThemedText>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  mt20: {
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    height: 48,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
})
