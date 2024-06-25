import { useThemeColor } from '@/hooks/useThemeColor'
import React from 'react'
import { ViewStyle } from 'react-native'
import { ThemedView } from './ThemedView'

export function Divider() {
  const backgroundColor = useThemeColor({}, 'bg_secondary')
  const styles: ViewStyle = { height: 1, backgroundColor, width: '100%' }

  return <ThemedView style={styles} />
}
