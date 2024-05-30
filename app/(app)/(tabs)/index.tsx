import {Image, StyleSheet, Platform} from 'react-native'

import ParallaxScrollView from '@/components/ParallaxScrollView'
import {ThemedText} from '@/components/ThemedText'
import {ThemedView} from '@/components/ThemedView'
import {useEffect, useState} from 'react'
import {getBudgets} from '@/data/queries'

export default function HomeScreen() {
  const [budgets, setBudgets] = useState<any>([])

  useEffect(() => {
    const load = async () => {
      const budgets = await getBudgets()
      setBudgets(budgets)
    }

    load()
  }, [])
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
      <ThemedView style={styles.titleContainer}>
        <ThemedText>TODO: title</ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText>Budgets:</ThemedText>
        {budgets.map((b: any) => {
          return <ThemedText key={b.id}>{b.name}</ThemedText>
        })}
      </ThemedView>
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
