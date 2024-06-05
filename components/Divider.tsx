import {ViewStyle, useColorScheme} from 'react-native'
import {ThemedView} from './ThemedView'
import {Colors} from '@/constants/Colors'
import {useThemeColor} from '@/hooks/useThemeColor'

export function Divider() {
  const backgroundColor = useThemeColor({}, 'bg_secondary')

  const styles: ViewStyle = {height: 1, backgroundColor, width: '100%'}

  return <ThemedView style={styles} />
}
