import { ThemedButton } from '@/components/Buttons/ThemedButton'
import { Page, Content, Spacer } from '@/components/Layout'
import List from '@/components/Lists/List'
import ListItem from '@/components/Lists/ListItem'
import { ThemedView } from '@/components/ThemedView'
import { PADDING } from '@/constants/Styles'
import { supabase } from '@/lib/supabase'
import { useLocalSettings } from '@/stores/localSettings'
import { Alert } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function AccountPresenter() {
  return <AccountScreen />
}

function AccountScreen() {
  const { resetState } = useLocalSettings()
  const insets = useSafeAreaInsets()

  const signOut = async () => {
    await supabase.auth.signOut()
    // clean up localSettings
    resetState()
  }

  const onSignOut = async () => {
    Alert.alert('Confirm', 'Do you really want to do this?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      { text: 'Sign Out', onPress: signOut, style: 'destructive' },
    ])
  }
  return (
    <Page title="Account" back>
      <Content>
        <List>
          <ListItem title="Sign Out" href="/settings/sign-out" />
        </List>
      </Content>
      <Spacer />
      <ThemedView
        style={{
          padding: PADDING,
          backgroundColor: 'transparent',
          paddingBottom: insets.bottom,
        }}
      >
        <ThemedButton title="Sign Out" onPress={onSignOut}></ThemedButton>
      </ThemedView>
    </Page>
  )
}
