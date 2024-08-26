import { StyleSheet } from 'react-native'
import Animated, {
  withRepeat,
  withSequence,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

import { ThemedText } from '@/components/ThemedText'

export function HelloWave() {
  const rotationAnimation = useSharedValue(0)
  const scaleAnimation = useSharedValue(1)

  rotationAnimation.value = withRepeat(
    withSequence(
      withTiming(25, { duration: 150 }),
      withTiming(0, { duration: 150 }),
    ),
    4, // Run the animation 4 times
  )

  scaleAnimation.value = withRepeat(
    withSequence(
      withTiming(2, { duration: 150 }),
      withTiming(1, { duration: 150 }),
    ),
    4,
  )

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${rotationAnimation.value}deg` },
      { scale: scaleAnimation.value },
    ],
  }))

  return (
    <Animated.View style={animatedStyle}>
      <ThemedText style={styles.text}>👋</ThemedText>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  text: {
    fontSize: 28,
    lineHeight: 32,
    marginTop: -6,
  },
})
