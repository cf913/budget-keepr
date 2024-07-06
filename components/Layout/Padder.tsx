import { PADDING } from '@/constants/Styles'
import { ThemedView } from '@/components/ThemedView'
import { ViewStyle } from 'react-native'

export default function Padder({
  h = 1,
  w = 0,
  hv,
  style = {},
}: {
  h?: number
  w?: number
  hv?: number
  style?: ViewStyle
}) {
  return (
    <ThemedView
      style={[
        { height: hv || h * PADDING, width: w * PADDING, backgroundColor: 'transparent' },
        style,
      ]}
    />
  )
}
