import {useState, useEffect} from 'react'
import {Image, StyleSheet} from 'react-native'
import {HelloWave} from '@/components/HelloWave'
import ParallaxScrollView from '@/components/ParallaxScrollView'
import {ThemedText} from '@/components/ThemedText'
import {ThemedView} from '@/components/ThemedView'
import {Loader} from '@/components/Loader'
import {getUser} from '@/data/queries'
import {getFirstName} from '@/utils/helpers'

export interface Profile {
  id: string
  full_name: string
  avatar_url: string
  billing_address: string
  payment_method: string
  email: string
}

export default function HomeScreen() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const data = await getUser()
      setProfile(data)
      setLoading(false)
    }
    load()
  }, [])

  const name = getFirstName(profile?.full_name)

  return (
    <ParallaxScrollView
      headerBackgroundColor={{light: '#A1CEDC', dark: '#1D3D47'}}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }
    >
      {loading ? (
        <Loader />
      ) : (
        <>
          <ThemedView style={styles.titleContainer}>
            <ThemedText type="title">Hello {name}!</ThemedText>
            <HelloWave />
          </ThemedView>
          <ThemedView style={styles.stepContainer}>
            <ThemedText>TODO: show some profile information here</ThemedText>
          </ThemedView>
        </>
      )}
    </ParallaxScrollView>
  )
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
})
