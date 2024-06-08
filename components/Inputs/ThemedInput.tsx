import {useThemeColor} from '@/hooks/useThemeColor'
import React, {forwardRef, useCallback} from 'react'
import {StyleSheet, TextInput, TextInputProps, ViewStyle} from 'react-native'
import Animated, {
  Easing,
  ReduceMotion,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput)

const withTimingConfig = {
  duration: 300,
  easing: Easing.in(Easing.ease),
  reduceMotion: ReduceMotion.System,
}

// eslint-disable-next-line react/display-name
const ThemedInput = forwardRef(
  (
    {
      onInputFocus,
      onInputBlur,
      value,
      onChangeText,
      placeholder,
      style = {},
      autofocus = false,
      ...props
    }: TextInputProps & {
      onInputFocus?: () => void
      onInputBlur?: () => void
      value: string
      onChangeText: any
      placeholder?: string
      style?: ViewStyle
      autofocus?: boolean
    },
    ref: any,
  ) => {
    const animatedColor = useSharedValue(0)
    const color = useThemeColor({}, 'text')
    const borderColor = useThemeColor({}, 'mid')
    const tintColor = useThemeColor({}, 'tint')
    const backgroundColor = useThemeColor({}, 'bg_secondary')

    const themeStyles = useAnimatedStyle(() => ({
      color: interpolateColor(animatedColor.value, [0, 1], [color, tintColor]),
      borderColor: interpolateColor(
        animatedColor.value,
        [0, 1],
        [borderColor, tintColor],
      ),
      backgroundColor,
    }))

    const onFocus = useCallback(() => {
      if (onInputFocus) onInputFocus()
      animatedColor.value = withTiming(1, withTimingConfig)
    }, [animatedColor, onInputFocus])

    const onBlur = useCallback(() => {
      if (onInputBlur) onInputBlur()
      animatedColor.value = withTiming(0, withTimingConfig)
    }, [animatedColor, onInputBlur])

    return (
      <AnimatedTextInput
        ref={ref}
        onFocus={onFocus}
        onBlur={onBlur}
        onChangeText={onChangeText}
        value={value}
        placeholder={placeholder}
        style={[styles.input, themeStyles, style]}
        autoFocus={autofocus}
        {...props}
      />
    )
  },
)

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    height: 48,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 8,
    fontSize: 16,
  },
})

export default ThemedInput
