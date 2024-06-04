import {ActivityIndicator, ViewStyle} from 'react-native'
import {ThemedView} from './ThemedView'

export function Loader({size = 'large'}: {size?: number | 'large' | 'small'}) {
  const styles: ViewStyle = {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  }

  return (
    <ThemedView style={styles}>
      <ActivityIndicator size={size} />
    </ThemedView>
  )
}
