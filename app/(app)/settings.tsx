import {ThemedButton} from '@/components/Buttons/ThemedButton'
import Page from '@/components/Layout/Page'
import Spacer from '@/components/Layout/Spacer'
import {ThemedText} from '@/components/ThemedText'
import {ThemedView} from '@/components/ThemedView'
import {PADDING, STYLES} from '@/constants/Styles'
import {supabase} from '@/lib/supabase'

export default function Settings() {
  return (
    <Page title="Settings">
      <ThemedText>TODO: Settings Screen</ThemedText>
      <Spacer />
      <ThemedView style={{padding: PADDING}}>
        <ThemedButton
          text="Sign Out"
          onPress={() => supabase.auth.signOut()}
        ></ThemedButton>
      </ThemedView>
    </Page>
  )
}
