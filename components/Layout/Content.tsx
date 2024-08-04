import { PADDING } from '@/constants/Styles'
import { ThemedView } from '@/components/ThemedView'
import { ReactNode } from 'react'
import { ViewProps, ViewStyle } from 'react-native'

export function Content({
  floating = false,
  style,
  children,
  ...props
}: {
  floating?: boolean
  style?: ViewStyle
  children: ReactNode
} & ViewProps) {
  const positionStyles: ViewStyle = floating
    ? {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
    }
    : {}
  return (
    <ThemedView
      style={[positionStyles, { paddingHorizontal: PADDING }, style]}
      {...props}
    >
      {children}
    </ThemedView>
  )
}
