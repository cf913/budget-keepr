import {StyleSheet} from 'react-native'
import {STYLES} from '@/constants/Styles'
import {ThemedView} from '../ThemedView'
import {DEV_SHOW_BOX} from '@/constants/config'

export default function Spacer() {
  const style = DEV_SHOW_BOX ? STYLES.border : {}
  return <ThemedView style={[styles.container, style]}></ThemedView>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 1,
    backgroundColor: 'transparent',
  },
})
