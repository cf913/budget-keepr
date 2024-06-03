import {useEffect, useState} from 'react'
import {Loader} from './Loader'
import {SubCategory} from './RecentEntries'
import {ThemedText} from './ThemedText'
import {ThemedView} from './ThemedView'
import {getCategories, searchCategories} from '@/data/queries'
import {useLocalSettings} from '@/stores/localSettings'
import ListItem from './Lists/ListItem'
import Padder from './Layout/Padder'
import {Divider} from './Divider'
import List from './Lists/List'

export default function CategorySuggestions({
  onSelect,
  searchText,
}: {
  onSelect: (subCat: SubCategory) => void
  searchText: string
}) {
  const {defaultBudget} = useLocalSettings()
  const [loading, setLoading] = useState(false)
  const [subCategories, setSubCategories] = useState<SubCategory[] | null>(null)

  useEffect(() => {
    // API call or other actions to be performed with debounced value
    const load = async () => {
      if (!defaultBudget) return
      if (searchText?.length < 1) {
        setSubCategories(null)
        return
      }
      if (!subCategories) setLoading(true)

      const data: any = await getCategories(defaultBudget.id, searchText)

      console.log('DATA', JSON.stringify(data, null, 2))
      setSubCategories(data || [])
      setLoading(false)
    }
    load()
  }, [searchText])

  return (
    <ThemedView>
      {loading ? (
        <Loader />
      ) : (
        <List>
          {(subCategories || []).map((subCat: SubCategory, i: number) => {
            return (
              <ListItem
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
