import {useThemeColor} from '@/hooks/useThemeColor'
import {ThemedText} from '../ThemedText'
import {ThemedView} from '../ThemedView'
import {StyleSheet} from 'react-native'
import {HEIGHT, PADDING, RADIUS} from '@/constants/Styles'

export default function ListItem() {
  const backgroundColor = useThemeColor(
    {},
    // {light: lightColor, dark: darkColor},
    'bg_secondary',
  )

  return (
    <ThemedView style={[{backgroundColor}, styles.container]}>
      <ThemedText>Default Budget</ThemedText>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: PADDING,
    height: HEIGHT.item,
  },
})
