import { Page, Content, Padder } from '@/components/Layout'
import List from '@/components/Lists/List'
import ListItem from '@/components/Lists/ListItem'
import { VERSION } from '@/constants/config'
import { useLocalSettings } from '@/stores/localSettings'
import * as Application from 'expo-application'

export default function Settings() {
  const { defaultBudget } = useLocalSettings()

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
          <ListItem title="Recurring" href="/settings/recurring" lastItem />
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
    </Page>
  )
}
