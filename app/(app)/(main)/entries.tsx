import Content from '@/components/Layout/Content'
import { Header } from '@/components/Layout/Header'
import Page from '@/components/Layout/Page'
import { ThemedText } from '@/components/ThemedText'

export default function Entries() {
  return (
    <Page
      scroll
      title="Entries"
      back
      // refreshing={refreshing}
      onRefresh={() => {
        // setRefreshing(true)
        // activeListRef.current?.refetch()
        // archivedListRef.current?.refetch()
        // setRefreshing(false)
      }}
    >
      <Content>
        <ThemedText>Entries</ThemedText>
      </Content>
    </Page>
  )
}
