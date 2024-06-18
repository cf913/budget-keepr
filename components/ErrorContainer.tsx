import {Feather} from '@expo/vector-icons'
import {ThemedText} from './ThemedText'
import {ThemedView} from './ThemedView'
import {useThemeColor} from '@/hooks/useThemeColor'
import {ThemedButton} from './Buttons/ThemedButton'
import Padder from './Layout/Padder'
import {TYPO} from '@/constants/Styles'
import Spacer from './Layout/Spacer'

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
      <ThemedButton onPress={onRetry} title="Try again" />
      <Padder />
    </ThemedView>
  )
}
