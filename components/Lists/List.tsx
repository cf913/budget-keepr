import { RADIUS, STYLES } from '@/constants/Styles'
import { useThemeColor } from '@/hooks/useThemeColor'
import { ReactNode } from 'react'
import { StyleSheet, ViewStyle } from 'react-native'
import { FadeIn } from 'react-native-reanimated'
import { AnimatedView, ThemedView } from '../ThemedView'

export default function List({
  children,
  style,
}: {
  children: ReactNode
  style?: ViewStyle
}) {
  const backgroundColor = useThemeColor({}, 'bg_secondary')
  return (
    <AnimatedView
      entering={FadeIn}
      style={[STYLES.shadow, styles.shadow_container, { backgroundColor }, style]}
    >
      <ThemedView style={[styles.container, { backgroundColor }]}>
        {children}
      </ThemedView>
    </AnimatedView>
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
