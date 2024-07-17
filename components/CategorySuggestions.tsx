import { getSubCategories } from '@/data/sub_categories'
import { useQuery } from '@tanstack/react-query'
import Fuse from 'fuse.js'
import { useEffect, useState } from 'react'
import { ThemedButton } from './Buttons/ThemedButton'
import List from './Lists/List'
import ListItemWithMatch from './Lists/ListItemWithMatch'
import { Loader } from './Loader'
import { SubCategory } from './RecentEntries'
import { ThemedText } from './ThemedText'
import { ThemedView } from './ThemedView'
import { useLocalSettings } from '@/stores/localSettings'
import { Padder } from './Layout'

export default function CategorySuggestions({
  visible,
  onSelect,
  onAddNew,
  searchText,
}: {
  visible: boolean
  onSelect: (subCat: SubCategory) => void
  onAddNew: () => void
  searchText: string
}) {
  const { defaultBudget } = useLocalSettings()

  const { data, error, isLoading } = useQuery({
    queryKey: ['sub_categories', { budget_id: defaultBudget?.id }],
    queryFn: () => getSubCategories({ budget_id: defaultBudget?.id }),
  })

  if (error) return <ThemedText>Error: {error.message} </ThemedText>

  if (!visible) return null

  return (
    <CategorySuggestionsScreen
      {...{ isLoading, data, onSelect, searchText, onAddNew }}
    />
  )
}

function CategorySuggestionsScreen({
  isLoading,
  data,
  onSelect,
  onAddNew,
  searchText,
}: {
  isLoading: boolean
  data: SubCategory[] | undefined
  onSelect: (subCat: SubCategory) => void
  onAddNew: () => void
  searchText: string
}) {
  const [subCategories, setSubCategories] = useState<SubCategory[] | null>(null)

  useEffect(() => {
    if (!data) return

    const options = {
      includeMatches: true,
      minMatchCharLength: 0,
      keys: ['name'],
      threshold: 0.3,
    }

    const fuse = new Fuse(data, options)

    const result = fuse.search(searchText)
    setSubCategories(result.map(({ item, ...rest }) => ({ ...item, ...rest })))
  }, [data, searchText])

  return (
    <ThemedView>
      {!subCategories?.length && searchText ? (
        <ThemedView>
          <Padder h={0.5} />
          <ThemedText>
            No results found for '
            <ThemedText style={{ fontWeight: 'bold' }}>{searchText}</ThemedText>
            '
          </ThemedText>
          <Padder h={0.5} />
          <ThemedButton title="+ Add new category" onPress={onAddNew} />
        </ThemedView>
      ) : null}
      {isLoading ? (
        <Loader />
      ) : (
        <List>
          {(subCategories || []).map((subCat: SubCategory, i: number) => {
            return (
              <ListItemWithMatch
                onSelect={onSelect}
                item={subCat}
                lastItem={i === (subCategories || []).length - 1}
                title={subCat.name}
                key={subCat.id}
                description={subCat.category?.name}
                category={subCat.category}
              />
            )
          })}
        </List>
      )}
    </ThemedView>
  )
}
