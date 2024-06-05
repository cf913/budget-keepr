import {ReactNode} from 'react'
import {ThemedView} from '../ThemedView'
import {StyleSheet, ViewStyle} from 'react-native'
import {PADDING, RADIUS, STYLES} from '@/constants/Styles'
import {useThemeColor} from '@/hooks/useThemeColor'

export default function List({
  children,
  style,
}: {
  children: ReactNode
  style?: ViewStyle
}) {
  const backgroundColor = useThemeColor({}, 'bg_secondary')
  return (
    <ThemedView
      style={[STYLES.shadow, styles.shadow_container, {backgroundColor}, style]}
    >
      <ThemedView style={[styles.container, {backgroundColor}]}>
        {children}
      </ThemedView>
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
