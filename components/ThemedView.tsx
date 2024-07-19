import {View, type ViewProps} from 'react-native'

import {useThemeColor} from '@/hooks/useThemeColor'
import Animated from 'react-native-reanimated'

export type ThemedViewProps = ViewProps & {
  lightColor?: string
  darkColor?: string
}

export function ThemedView({
  style,
  lightColor,
  darkColor,
  ...otherProps
}: ThemedViewProps) {
  const backgroundColor = useThemeColor(
    {light: lightColor, dark: darkColor},
    'bg',
  )

  return <View style={[{backgroundColor}, style]} {...otherProps} />
}

export const AnimatedView = Animated.createAnimatedComponent(View)
