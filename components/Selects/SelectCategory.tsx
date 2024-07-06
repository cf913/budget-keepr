import { getCategories } from "@/data/categories"
import { queryClient } from "@/lib/tanstack"
import { useLocalSettings } from "@/stores/localSettings"
import { isLastItem } from "@/utils/helpers"
import { useQuery } from "@tanstack/react-query"
import ErrorContainer from "../ErrorContainer"
import Content from "../Layout/Content"
import List from "../Lists/List"
import ListItem from "../Lists/ListItem"
import { Loader } from "../Loader"
import { Category } from "../RecentEntries"

type SelectCategoryProps = {
  callback?: (category: Category) => void
  value?: Category | null
}

export default function SelectCategory({ callback, value }: SelectCategoryProps) {
  const { defaultBudget } = useLocalSettings()

  const { data, error, refetch, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories(defaultBudget?.id),
  })

  const onSelectCategory = async (category: Category) => {
    if (callback) callback(category)
  }

  return (

    <Content>
      {!isLoading && error ? (
        <ErrorContainer error={error.message} onRetry={refetch} />
      ) : null}
      {isLoading ? <Loader /> : null}
      {data ? (
        <List entering={null}>
          {data.map((category: Category, index: number) => {
            return (
              <ListItem
                onSelect={() => onSelectCategory(category)}
                key={category.id}
                title={category.name}
                category={category}
                lastItem={isLastItem(data, index)}
                checked={value?.id === category.id}
              ></ListItem>
            )
          })}
        </List>
      ) : null}
    </Content>
  )
}
