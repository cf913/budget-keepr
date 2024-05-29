import {ViewStyle, useColorScheme} from 'react-native'
import {ThemedView} from './ThemedView'
import {Colors} from '@/constants/Colors'

export function Divider() {
  const theme = useColorScheme() ?? 'light'

  const styles: ViewStyle = {height: 1, backgroundColor: Colors[theme].gray, width: '100%'}

  return <ThemedView style={styles} />
}
