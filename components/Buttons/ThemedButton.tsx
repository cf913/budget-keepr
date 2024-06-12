import {StyleSheet, Pressable, type ViewProps} from 'react-native'

import {useThemeColor} from '@/hooks/useThemeColor'
import {ThemedText} from '../ThemedText'
import {HEIGHT, RADIUS} from '@/constants/Styles'
import {Feather} from '@expo/vector-icons'
import {Loader} from '../Loader'
import {AnimatedView} from '../ThemedView'
import {FadeIn, FadeInDown, FadeOut, FadeOutUp} from 'react-native-reanimated'

export type ThemedViewProps = ViewProps & {
  round?: boolean
  loading?: boolean
  title: string
  onPress?: () => void
  lightColor?: string
  darkColor?: string
}

const ROUND_WIDTH = HEIGHT.item * 1.2

export function ThemedButton({
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
    {light: lightColor, dark: darkColor},
    'bg_secondary',
  )

  const textColor = useThemeColor({}, 'text')

  return (
    <Pressable
      onPress={onPress}
      disabled={loading}
      style={[
        {backgroundColor},
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
        <AnimatedView exiting={FadeOut} entering={FadeIn}>
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
    width: '100%',
    height: HEIGHT.item,
    borderRadius: RADIUS,
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
