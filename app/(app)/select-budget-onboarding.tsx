import Content from '@/components/Layout/Content'
import {Header} from '@/components/Layout/Header'
import Page from '@/components/Layout/Page'
import List from '@/components/Lists/List'
import ListItem from '@/components/Lists/ListItem'
import {Loader} from '@/components/Loader'
import {getBudgets} from '@/data/queries'
import {Budget, useLocalSettings} from '@/stores/localSettings'
import {isLastItem} from '@/utils/helpers'
import {useQuery} from '@tanstack/react-query'
import {Stack, router} from 'expo-router'

export default function SelectBudget() {
  const {defaultBudget, setDefaultBudget} = useLocalSettings()

  const {data, error, refetch, isLoading} = useQuery({
    queryKey: ['budgets'],
    queryFn: getBudgets,
  })

  const onSelectBudget = async (budget: Budget) => {
    await setDefaultBudget(budget)
    router.replace('/(main)')
  }

  return (
    <Page title="Select Budget">
      <Stack.Screen options={{headerShown: false}} />
      <Content>
        {isLoading ? <Loader /> : null}
        {data ? (
          <List>
            {data.map((budget: Budget, index: number) => {
              return (
                <ListItem
                  onSelect={() => onSelectBudget(budget)}
                  key={budget.id}
                  title={budget.name}
                  lastItem={isLastItem(data, index)}
                  checked={defaultBudget?.id === budget.id}
                ></ListItem>
              )
            })}
          </List>
        ) : null}
      </Content>
    </Page>
  )
}
