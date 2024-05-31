import {PADDING} from '@/constants/Styles'
import {ThemedView} from '@/components/ThemedView'

export default function Padder({h = 1}) {
  return <ThemedView style={{height: h * PADDING}} />
}
