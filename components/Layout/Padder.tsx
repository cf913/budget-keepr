import {PADDING} from '@/constants/Styles'
import {ThemedView} from '@/components/ThemedView'
import {ViewStyle} from 'react-native'

export default function Padder({
  h = 1,
  style = {},
}: {
  h?: number
  style?: ViewStyle
}) {
  return (
    <ThemedView
      style={[{height: h * PADDING, backgroundColor: 'transparent'}, style]}
    />
  )
}
