import {ReactNode} from 'react'
import {ThemedView} from '../ThemedView'
import {StyleSheet, ViewStyle} from 'react-native'
import {PADDING, RADIUS, STYLES} from '@/constants/Styles'

export default function List({
  children,
  style,
}: {
  children: ReactNode
  style?: ViewStyle
}) {
  return (
    <ThemedView style={[STYLES.shadow, styles.shadow_container, style]}>
      <ThemedView style={styles.container}>{children}</ThemedView>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  shadow_container: {
    borderRadius: RADIUS,
  },
  container: {
    borderRadius: RADIUS,
    overflow: 'hidden',
  },
})
