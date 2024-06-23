import { TYPO } from '@/constants/Styles'
import { ThemedText } from '../ThemedText'

export default function PreviewDisclaimer() {
  return (
    <ThemedText style={{ opacity: 0.3, ...TYPO.small, textAlign: 'justify' }}>
      Please make sure the values above look correct. The DELETE entries feature
      has not been implemented yet. A mistake here will follow you forever and
      you might end up filled with regrets for not having double checked your
      entry. Do the right thing. It only takes a couple seconds. Sorry for the
      inconvenience.
    </ThemedText>
  )
}
