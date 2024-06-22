import { PADDING } from '@/constants/Styles'
import { ThemedView } from '@/components/ThemedView'
import { ReactNode } from 'react'
import { ViewStyle } from 'react-native'

export default function Content({
  floating = false,
  style,
  children,
}: {
  floating?: boolean
  style?: ViewStyle
  children: ReactNode
}) {
  const positionStyles: ViewStyle = floating
    ? {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
    }
    : {}
  return (
    <ThemedView style={[positionStyles, { paddingHorizontal: PADDING }, style]}>
      {children}
    </ThemedView>
  )
}
