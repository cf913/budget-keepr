import {useThemeColor} from '@/hooks/useThemeColor'
import {ThemedText} from '../ThemedText'
import {ThemedView} from '../ThemedView'
import {PADDING, RADIUS, STYLES, TYPO} from '@/constants/Styles'
import {StyleSheet} from 'react-native'

export default function Card({title, value}: {title?: string; value: string}) {
  const backgroundColor = useThemeColor({}, 'bg_secondary')
  const textColor = useThemeColor({}, 'text')
  const tintColor = useThemeColor({}, 'tint')

  return (
    <ThemedView style={[styles.card, {backgroundColor}]}>
      <ThemedText style={[styles.title, {color: tintColor}]}>
        {title}
      </ThemedText>
      <ThemedText style={[styles.value, {color: textColor}]}>
        {value}
      </ThemedText>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  card: {
    ...STYLES.shadow,
    borderRadius: RADIUS,
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: PADDING,
  },
  title: {
    ...TYPO.small,
  },
  value: {
    ...TYPO.card_value,
  },
})
