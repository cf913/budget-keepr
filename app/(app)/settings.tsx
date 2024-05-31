import {ThemedButton} from '@/components/Buttons/ThemedButton'
import Content from '@/components/Layout/Content'
import Page from '@/components/Layout/Page'
import Spacer from '@/components/Layout/Spacer'
import List from '@/components/Lists/List'
import ListItem from '@/components/Lists/ListItem'
import {ThemedView} from '@/components/ThemedView'
import {PADDING, STYLES} from '@/constants/Styles'
import {supabase} from '@/lib/supabase'

export default function Settings() {
  return (
    <Page withHeader title="Settings">
      {/* TODO: build a list of clickable items relating to each setting */}
      {/* SELECT DEFAULT BUDGET */}
      <Content>
        <List>
          <ListItem />
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
