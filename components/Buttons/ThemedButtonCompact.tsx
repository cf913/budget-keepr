import { Pressable, StyleSheet, type ViewProps } from 'react-native'

import { HEIGHT, PADDING } from '@/constants/Styles'
import { useThemeColor } from '@/hooks/useThemeColor'
import { Feather } from '@expo/vector-icons'
import { FadeIn } from 'react-native-reanimated'
import { Loader } from '../Loader'
import { ThemedText } from '../ThemedText'
import { AnimatedView } from '../ThemedView'

export type ThemedViewProps = ViewProps & {
  round?: boolean
  loading?: boolean
  title: string
  onPress?: () => void
  lightColor?: string
  darkColor?: string
}

const ROUND_WIDTH = HEIGHT.item * 1.2

export function ThemedButtonCompact({
  round = false,
  loading = false,
  title,
  onPress,
  style,
  lightColor,
  darkColor,
  ...otherProps
}: ThemedViewProps) {
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    'bg_secondary',
  )

  const textColor = useThemeColor({}, 'text')

  return (
    <Pressable
      onPress={onPress}
      disabled={loading}
      style={[
        {
          backgroundColor,
          padding: PADDING / 4,
          paddingHorizontal: PADDING,
          borderRadius: 8,
        },
        round ? styles.round : styles.default_shape,
        style,
      ]}
      hitSlop={20}
      {...otherProps}
    >
      {loading ? (
        <Loader size="small" />
      ) : round ? (
        // ICON
        <Feather name="plus" size={ROUND_WIDTH / 2} color={textColor} />
      ) : (
        // TEXT
        <AnimatedView entering={FadeIn.duration(200)}>
          <ThemedText style={styles.text}>{title}</ThemedText>
        </AnimatedView>
      )}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  default_shape: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  round: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
    width: ROUND_WIDTH,
    height: ROUND_WIDTH,
    borderRadius: ROUND_WIDTH / 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 24,
  },
  text: {
    fontWeight: 'bold',
  },
})
