import { Pressable, StyleSheet } from 'react-native'
import { Feather, Ionicons } from '@expo/vector-icons'
import { useThemeColor } from '@/hooks/useThemeColor'
import { AnimatedView } from '../ThemedView'
import {
  BounceIn,
  ZoomIn,
  ZoomInRotate,
  ZoomOut,
} from 'react-native-reanimated'

export default function ThemedCheckbox({
  checked = false,
  onChange = () => {},
  buttonStyle = {},
  activeButtonStyle = {},
  inactiveButtonStyle = {},
  activeIconProps = {},
  inactiveIconProps = {},
}) {
  const iconProps = checked ? activeIconProps : inactiveIconProps
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
    >
      {checked && (
        <AnimatedView entering={ZoomIn.duration(200)} exiting={ZoomOut}>
          <Feather name="check" size={18} color="white" {...iconProps} />
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
