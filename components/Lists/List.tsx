import { RADIUS, STYLES } from '@/constants/Styles'
import { useThemeColor } from '@/hooks/useThemeColor'
import { ReactNode } from 'react'
import { StyleSheet, ViewStyle } from 'react-native'
import { FadeIn } from 'react-native-reanimated'
import { AnimatedView, ThemedView } from '../ThemedView'

export default function List({
  children,
  style,
  shadow = false,
  entering = FadeIn
}: {
  children: ReactNode
  style?: ViewStyle
  shadow?: boolean
  entering?: any
}) {
  const backgroundColor = useThemeColor({}, 'bg_secondary')
  const shadowStyle = shadow ? STYLES.shadow : {}
  return (
    <AnimatedView
      entering={entering}
      style={[shadowStyle, styles.shadow_container, { backgroundColor }, style]}
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
