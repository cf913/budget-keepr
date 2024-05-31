import {ReactNode} from 'react'
import {ThemedView} from '../ThemedView'
import {StyleSheet} from 'react-native'
import {RADIUS} from '@/constants/Styles'

export default function List({children}: {children: ReactNode}) {
  return <ThemedView style={styles.container}>{children}</ThemedView>
}

const styles = StyleSheet.create({
  container: {
    borderRadius: RADIUS,
    overflow: 'hidden',
  },
})
