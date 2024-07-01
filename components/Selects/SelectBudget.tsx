import { Budget, useLocalSettings } from "@/stores/localSettings"
import { isLastItem } from "@/utils/helpers"
import ErrorContainer from "../ErrorContainer"
import Content from "../Layout/Content"
import List from "../Lists/List"
import ListItem from "../Lists/ListItem"
import { Loader } from "../Loader"
import { getBudgets } from "@/data/queries"
import { queryClient } from "@/lib/tanstack"
import { useQuery } from "@tanstack/react-query"

type SelectBudgetProps = {
  callback?: () => void
}

export default function SelectBudget({ callback }: SelectBudgetProps) {
  const { defaultBudget, setDefaultBudget } = useLocalSettings()

  const { data, error, refetch, isLoading } = useQuery({
    queryKey: ['budgets'],
    queryFn: getBudgets,
  })

  const onSelectBudget = async (budget: Budget) => {
    await setDefaultBudget(budget)
    queryClient.invalidateQueries()

    if (callback) callback()
  }

  return (

    <Content>
      {!isLoading && error ? (
        <ErrorContainer error={error.message} onRetry={refetch} />
      ) : null}
      {isLoading ? <Loader /> : null}
      {data ? (
        <List entering={null}>
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
  )
}
