import { TYPO } from '@/constants/Styles'
import { useThemeColor } from '@/hooks/useThemeColor'
import { Feather } from '@expo/vector-icons'
import { ThemedButton } from './Buttons/ThemedButton'
import { ThemedText } from './ThemedText'
import { ThemedView } from './ThemedView'
import { Padder } from './Layout'
export default function ErrorContainer({
  error,
  onRetry,
}: {
  error: string
  onRetry?: () => void
}) {
  const tintColor = useThemeColor({}, 'tint')
  return (
    <ThemedView
      style={{
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Padder />
      <Feather name="alert-triangle" size={64} color={tintColor} />
      <Padder />
      <ThemedText style={TYPO.title_compact}>Oops</ThemedText>
      <ThemedText>{error}</ThemedText>
      <Padder />
      <Padder />
      {onRetry ? <ThemedButton onPress={onRetry} title="Try again" /> : null}
      <Padder />
    </ThemedView>
  )
}
