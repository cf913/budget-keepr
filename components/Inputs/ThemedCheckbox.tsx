import { useThemeColor } from '@/hooks/useThemeColor'
import { Feather } from '@expo/vector-icons'
import { Pressable, StyleSheet } from 'react-native'
import {
  ZoomIn,
  ZoomOut
} from 'react-native-reanimated'
import { AnimatedView } from '../ThemedView'

export default function ThemedCheckbox({
  checked = false,
  onChange = () => { },
  inactiveButtonStyle = {},
  activeIconProps = {},
  inactiveIconProps = {},
}) {
  const iconProps = checked ? activeIconProps : inactiveIconProps
  const textColor = useThemeColor({}, 'text')
  const tintColor = useThemeColor({}, 'tint')
  const midColor = useThemeColor({}, 'mid')

  return (
    <Pressable
      style={[
        styles.checkboxBase,
        { borderColor: midColor },
        checked ? { borderColor: tintColor } : inactiveButtonStyle,
      ]}
      onPress={onChange}
      hitSlop={10}
    >
      {checked && (
        <AnimatedView entering={ZoomIn.duration(200)} exiting={ZoomOut}>
          <Feather name="check" size={18} color={textColor} {...iconProps} />
        </AnimatedView>
      )}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  checkboxBase: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderWidth: 2,
    backgroundColor: 'transparent',
  },
  checkboxChecked: {
    // backgroundColor: 'coral',
  },
})
