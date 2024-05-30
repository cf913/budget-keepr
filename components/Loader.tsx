import {ActivityIndicator, ViewStyle} from 'react-native'
import {ThemedView} from './ThemedView'

export function Loader() {
  const styles: ViewStyle = {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  }

  return (
    <ThemedView style={styles}>
      <ActivityIndicator size={'large'} />
    </ThemedView>
  )
}
