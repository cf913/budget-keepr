import { ActivityIndicator, ViewStyle } from 'react-native'
import { FadeIn, FadeOut } from 'react-native-reanimated'
import { AnimatedView } from './ThemedView'

export function Loader({
  size = 'large',
}: {
  size?: number | 'large' | 'small'
}) {
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
