import { PADDING, RADIUS, TYPO } from '@/constants/Styles'
import { useThemeColor } from '@/hooks/useThemeColor'
import { StyleSheet } from 'react-native'
import { FlipInXUp, FlipOutXDown } from 'react-native-reanimated'
import Padder from '../Layout/Padder'
import { Loader } from '../Loader'
import { ThemedText } from '../ThemedText'
import { AnimatedView, ThemedView } from '../ThemedView'

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
    <ThemedView style={[styles.card, { backgroundColor }]}>
      <ThemedText style={[styles.title, { color: tintColor }]}>
        {title}
      </ThemedText>
      <Padder h={0.3} />
      {loading ? (
        <Loader size="small" />
      ) : (
        <AnimatedView entering={FlipInXUp} exiting={FlipOutXDown}>
          <ThemedText style={[styles.value, { color: textColor }]}>
            {value}
          </ThemedText>
        </AnimatedView>
      )}
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  card: {
    // ...STYLES.shadow,
    borderRadius: RADIUS,
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: PADDING,
    paddingVertical: PADDING / 1.5,
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
