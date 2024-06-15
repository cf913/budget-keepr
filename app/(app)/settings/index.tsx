import {ThemedButton} from '@/components/Buttons/ThemedButton'
import Content from '@/components/Layout/Content'
import Padder from '@/components/Layout/Padder'
import Page from '@/components/Layout/Page'
import Spacer from '@/components/Layout/Spacer'
import List from '@/components/Lists/List'
import ListItem from '@/components/Lists/ListItem'
import {ThemedView} from '@/components/ThemedView'
import {PADDING} from '@/constants/Styles'
import {VERSION} from '@/constants/config'
import {supabase} from '@/lib/supabase'
import {useLocalSettings} from '@/stores/localSettings'
import * as Application from 'expo-application'
import {Alert} from 'react-native'
import {useSafeAreaInsets} from 'react-native-safe-area-context'

export default function Settings() {
  const {defaultBudget} = useLocalSettings()
  const insets = useSafeAreaInsets()

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const onSignOut = async () => {
    Alert.alert('Confirm', 'Do you really want to do this?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'Sign Out', onPress: signOut, style: 'destructive'},
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
          <ListItem title="Categories" href="/settings/categories" lastItem />
        </List>
        <Padder />
        <List>
          <ListItem
            title={`${Application.nativeApplicationVersion}`}
            description={`${VERSION}`}
            lastItem
          />
        </List>
      </Content>
      {/* ///////////////////////// */}
      <Spacer />
      <ThemedView
        style={{
          padding: PADDING,
          backgroundColor: 'transparent',
          paddingBottom: insets.bottom,
        }}
      >
        <ThemedButton
          title="Sign Out"
          // onPress={() => supabase.auth.signOut()}
          onPress={onSignOut}
        ></ThemedButton>
      </ThemedView>
    </Page>
  )
}
