import {useEffect, useState} from 'react'
import {Loader} from './Loader'
import {SubCategory} from './RecentEntries'
import {ThemedText} from './ThemedText'
import {ThemedView} from './ThemedView'
import {useLocalSettings} from '@/stores/localSettings'
import ListItem from './Lists/ListItem'
import Padder from './Layout/Padder'
import {Divider} from './Divider'
import List from './Lists/List'
import {getSubCategories, searchSubCategories} from '@/data/sub_categories'
import {useQuery} from '@tanstack/react-query'
import Fuse from 'fuse.js'
import ListItemWithMatch from './Lists/ListItemWithMatch'
import {ThemedButton} from './Buttons/ThemedButton'
import {router} from 'expo-router'

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
  const {data, error, isLoading} = useQuery({
    queryKey: ['sub_categories'],
    queryFn: () => getSubCategories(),
  })

  if (error) return <ThemedText>Error: {error.message} </ThemedText>

  if (!visible) return null

  return (
    <CategorySuggestionsScreen
      {...{isLoading, data, onSelect, searchText, onAddNew}}
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
    }

    const fuse = new Fuse(data, options)

    const result = fuse.search(searchText)
    setSubCategories(result.map(({item, ...rest}) => ({...item, ...rest})))
  }, [searchText])

  return (
    <ThemedView>
      {!subCategories?.length ? (
        <ThemedView>
          <Padder h={0.5} />
          <ThemedText>
            No results found for '
            <ThemedText style={{fontWeight: 'bold'}}>{searchText}</ThemedText>'
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
                description={subCat.categories?.name}
              />
            )
          })}
        </List>
      )}
    </ThemedView>
  )
}
