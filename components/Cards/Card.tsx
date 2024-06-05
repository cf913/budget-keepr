import {useThemeColor} from '@/hooks/useThemeColor'
import {ThemedText} from '../ThemedText'
import {ThemedView} from '../ThemedView'
import {PADDING, RADIUS, STYLES, TYPO} from '@/constants/Styles'
import {StyleSheet} from 'react-native'
import Padder from '../Layout/Padder'
import {Loader} from '../Loader'

export default function Card({
  title,
  value,
  loading,
}: {
  title?: string
  value: string
  loading?: boolean
}) {
  const backgroundColor = useThemeColor({}, 'bg_secondary')
  const textColor = useThemeColor({}, 'text')
  const tintColor = useThemeColor({}, 'mid')

  return (
    <ThemedView style={[styles.card, {backgroundColor}]}>
      {loading ? (
        <Loader />
      ) : (
        <>
          <ThemedText style={[styles.title, {color: tintColor}]}>
            {title}
          </ThemedText>
          <Padder h={0.3} />
          <ThemedText style={[styles.value, {color: textColor}]}>
            {value}
          </ThemedText>
        </>
      )}
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
    minWidth: '40%',
  },
  title: {
    ...TYPO.small,
    fontWeight: 'bold',
    // textTransform: 'uppercase',
    // letterSpacing: 2,
  },
  value: {
    ...TYPO.card_value,
  },
})
