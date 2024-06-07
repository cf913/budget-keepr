import {ThemedButton} from '@/components/Buttons/ThemedButton'
import Content from '@/components/Layout/Content'
import Padder from '@/components/Layout/Padder'
import Page from '@/components/Layout/Page'
import List from '@/components/Lists/List'
import ListItem from '@/components/Lists/ListItem'
import {ThemedView} from '@/components/ThemedView'
import {PADDING} from '@/constants/Styles'
import {VERSION} from '@/constants/config'
import {supabase} from '@/lib/supabase'
import {useLocalSettings} from '@/stores/localSettings'

export default function Settings() {
  const {defaultBudget} = useLocalSettings()
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
          <ListItem title="Another one" description="with a desc" lastItem />
        </List>
        <Padder />
        <List>
          <ListItem title="Jeez.. when will then stop" description="Note: 0" />
          <ListItem title="Version" description={VERSION} lastItem />
        </List>
      </Content>
      {/* ///////////////////////// */}
      <Padder />
      <Padder />
      <ThemedView
        style={{
          padding: PADDING,
          backgroundColor: 'transparent',
        }}
      >
        <ThemedButton
          title="Sign Out"
          onPress={() => supabase.auth.signOut()}
        ></ThemedButton>
      </ThemedView>
    </Page>
  )
}
