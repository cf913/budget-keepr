import React, {useRef, useEffect} from 'react'
import {Animated, Text, View} from 'react-native'
import type {PropsWithChildren} from 'react'
import type {ViewStyle} from 'react-native'

export default function FadeInView(
  props: PropsWithChildren & {style: ViewStyle},
) {
  const fadeAnim = useRef(new Animated.Value(0)).current // Initial value for opacity: 0

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start()
  }, [fadeAnim])

  return (
    <Animated.View // Special animatable View
      style={[
        props.style,
        {opacity: fadeAnim}, // Bind opacity to animated value
      ]}
    >
      {props.children}
    </Animated.View>
  )
}
