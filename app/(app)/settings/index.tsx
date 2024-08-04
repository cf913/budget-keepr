import { ThemedButton } from '@/components/Buttons/ThemedButton'
import { Content, Padder, Page, Spacer } from '@/components/Layout'
import List from '@/components/Lists/List'
import ListItem from '@/components/Lists/ListItem'
import { VERSION } from '@/constants/config'
import { supabase } from '@/lib/supabase'
import { useLocalSettings } from '@/stores/localSettings'
import * as Application from 'expo-application'
import { Alert } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function Settings() {
  const { defaultBudget, resetState } = useLocalSettings()
  const insets = useSafeAreaInsets()

  const signOut = async () => {
    await supabase.auth.signOut()
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
    <Page title="Settings" back>
      {/* TODO: build a list of clickable items relating to each setting */}
      {/* SELECT DEFAULT BUDGET */}
      <Content>
        <List>
          <ListItem
            href="/settings/select-budget"
            title="Default Budget"
            description={defaultBudget?.name}
          />
          <ListItem title="Categories" href="/settings/categories" />
          <ListItem
            title="Recurring"
            href="/(main)/recurrings"
            lastItem
            replace
          />
        </List>
        <Padder />
        <List>
          <ListItem title="Account" href="/settings/account" lastItem />
        </List>
        <Padder />
        <List>
          <ListItem
            title={`${Application.nativeApplicationVersion}`}
            description={`${VERSION}${__DEV__ ? ' ' + process.env.EXPO_PUBLIC_SUPABASE_URL : ''}`}
            lastItem
          />
        </List>
      </Content>
      {/* ///////////////////////// */}
      <Spacer />
      <Content style={{ paddingBottom: insets.bottom }}>
        <ThemedButton title="Logout" onPress={onSignOut} />
      </Content>
    </Page>
  )
}
