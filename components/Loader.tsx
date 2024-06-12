import {ActivityIndicator, ViewStyle} from 'react-native'
import {AnimatedView, ThemedView} from './ThemedView'
import {
  FadeIn,
  FadeInDown,
  FadeInUp,
  FadeOut,
  FadeOutDown,
} from 'react-native-reanimated'

export function Loader({size = 'large'}: {size?: number | 'large' | 'small'}) {
  const styles: ViewStyle = {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  }

  return (
    <AnimatedView style={styles} entering={FadeIn} exiting={FadeOut}>
      <ActivityIndicator size={size} />
    </AnimatedView>
  )
}
