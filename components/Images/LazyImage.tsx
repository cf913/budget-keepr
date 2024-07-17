import { useColors } from '@/hooks/useColors'
import React, { useState } from 'react'
import {
  Image,
  ImageProps,
  View,
  ActivityIndicator,
  StyleSheet,
} from 'react-native'
import Animated, {
  FadeIn,
  ZoomIn,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

const AnimatedImage = Animated.createAnimatedComponent(Image)

interface LazyImageProps extends ImageProps { }

const LazyImage: React.FC<LazyImageProps> = ({ source, style, ...props }) => {
  const opacityValue = useSharedValue(0)
  const [loading, setLoading] = useState(true)
  const { tintColor } = useColors()

  return (
    <View style={[styles.container, style]}>
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator color={tintColor} />
        </View>
      ) : null}
      <AnimatedImage
        entering={ZoomIn.duration(200)}
        source={source}
        style={[style, { opacity: opacityValue }]}
        onLoadStart={() => {
          setLoading(true)
          opacityValue.value = withTiming(0, { duration: 400 })
        }}
        onLoadEnd={() => {
          setLoading(false)
          opacityValue.value = withTiming(1, { duration: 400 })
        }}
        {...props}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default LazyImage
