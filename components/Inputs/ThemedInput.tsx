import React from 'react'
import {StyleSheet, TextInput, ViewStyle} from 'react-native'

export default function ThemedInput({
  value,
  onChangeText,
  placeholder,
  style = {},
  autofocus = false,
  ...props
}: {
  value: string
  onChangeText: any
  placeholder?: string
  style?: ViewStyle
  autofocus?: boolean
}) {
  return (
    <TextInput
      onChangeText={onChangeText}
      value={value}
      placeholder={placeholder}
      style={[styles.input, style]}
      autoFocus={autofocus}
      {...props}
    />
  )
}

const styles = StyleSheet.create({
  input: {},
})
