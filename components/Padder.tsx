import {ThemedView} from './ThemedView'

export default function Padder({h = 1}) {
  return <ThemedView style={{height: h * 16}} />
}
