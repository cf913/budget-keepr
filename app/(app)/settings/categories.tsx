import { ThemedButton } from '@/components/Buttons/ThemedButton'
import { Content, Padder, Page } from '@/components/Layout'
import List from '@/components/Lists/List'
import ListItem from '@/components/Lists/ListItem'
import { Loader } from '@/components/Loader'
import { ThemedText } from '@/components/ThemedText'
import { getCategories } from '@/data/categories'
import { useThemeColor } from '@/hooks/useThemeColor'
import { useLocalSettings } from '@/stores/localSettings'
import { isLastItem } from '@/utils/helpers'
import { Feather } from '@expo/vector-icons'
import { useQuery } from '@tanstack/react-query'
import { router } from 'expo-router'
import { useState } from 'react'
import { Animated } from 'react-native'
import { RectButton, Swipeable } from 'react-native-gesture-handler'

export default function Categories() {
  const [refreshing, setRefreshing] = useState(false)
  const { defaultBudget } = useLocalSettings()

  const textColor = useThemeColor({}, 'text')

  const { data, error, refetch, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories(defaultBudget?.id),
  })

  if (error) {
    console.log('error', error.message)
    alert('Oops. ' + error.message)
  }

  const onEdit = (id: string) => {
    router.push(`/settings/category/${id}/edit`)
  }

  return (
    <Page
      scroll
      title="Main Categories"
      back
      refreshing={refreshing}
      onRefresh={async () => {
        setRefreshing(true)
        await refetch()
        setRefreshing(false)
      }}
      footer={
        // isAdmin(session) ? (
        <ThemedButton
          round
          onPress={() => router.push('/settings/category-create')}
          title=""
          style={{ zIndex: 99 }}
        ></ThemedButton>
        // ) : null
      }
    >
      <Content>
        {isLoading ? <Loader /> : null}
        {data ? (
          <List>
            {(data || []).map((category, i) => {
              return (
                <Swipeable
                  key={category.id}
                  renderRightActions={() => (
                    <RectButton
                      style={[
                        {},
                        {
                          width: 70,
                          justifyContent: 'center',
                          alignItems: 'center',
                        },
                      ]}
                      onPress={() => onEdit(category.id)}
                    >
                      <Animated.Text
                        style={[
                          // styles.actionText,
                          {
                            // transform: [{translateX: trans}],
                          },
                        ]}
                      >
                        <Feather name="edit" size={24} color={textColor} />
                      </Animated.Text>
                    </RectButton>
                  )}
                >
                  <ListItem
                    href={`/settings/category/${category.id}`}
                    title={category.name}
                    right={category.sub_categories?.length}
                    key={category.id}
                    lastItem={isLastItem(data, i)}
                    category={category}
                  />
                </Swipeable>
              )
            })}
          </List>
        ) : null}
        {data && !data.length ? (
          <ThemedText>
            Looks like you don't have any categories at this very point in time.
          </ThemedText>
        ) : null}
        {error ? <ThemedText>Error: {error.message}</ThemedText> : null}
      </Content>
      <Padder />
      <Padder />
    </Page>
  )
}
