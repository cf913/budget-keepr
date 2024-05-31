import {StyleSheet, Pressable, View, type ViewProps} from 'react-native'

import {useThemeColor} from '@/hooks/useThemeColor'
import {ThemedText} from '../ThemedText'
import {Colors} from '@/constants/Colors'
import {HEIGHT, RADIUS} from '@/constants/Styles'

export type ThemedViewProps = ViewProps & {
  text: string
  onPress?: () => void
  lightColor?: string
  darkColor?: string
}

export function ThemedButton({
  text,
  onPress,
  style,
  lightColor,
  darkColor,
  ...otherProps
}: ThemedViewProps) {
  const backgroundColor = useThemeColor(
    {light: lightColor, dark: darkColor},
    'bg_secondary',
  )

  return (
    <Pressable
      onPress={onPress}
      style={[{backgroundColor}, styles.shape, style]}
      {...otherProps}
    >
      <ThemedText style={styles.text}>{text}</ThemedText>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  shape: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: HEIGHT.item,
    borderRadius: RADIUS,
  },
  text: {
    fontWeight: 'bold',
  },
})
