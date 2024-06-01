import {ThemedButton} from '@/components/Buttons/ThemedButton'
import Content from '@/components/Layout/Content'
import Page from '@/components/Layout/Page'
import Spacer from '@/components/Layout/Spacer'
import List from '@/components/Lists/List'
import ListItem from '@/components/Lists/ListItem'
import {ThemedView} from '@/components/ThemedView'
import {PADDING} from '@/constants/Styles'
import {supabase} from '@/lib/supabase'
import {useLocalSettings} from '@/stores/localSettings'

export default function Settings() {
  const {defaultBudget} = useLocalSettings()
  return (
    <Page withHeader title="Settings">
      {/* TODO: build a list of clickable items relating to each setting */}
      {/* SELECT DEFAULT BUDGET */}
      <Content>
        <List>
          <ListItem
            href="/settings/select-budget"
            description={defaultBudget?.name}
          />
          <ListItem />
          <ListItem description="with a desc" lastItem />
        </List>
        <List>
          <ListItem description="Note: 0" />
          <ListItem lastItem />
        </List>
      </Content>
      {/* ///////////////////////// */}
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
