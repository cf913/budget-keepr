import Page from '@/components/Layout/Page'
import { Category } from '@/components/RecentEntries'
import SelectCategory from '@/components/Selects/SelectCategory'
import { useTempStore } from '@/stores/tempStore'
import { router } from 'expo-router'

export default function SelectCategoryScreen() {
  const { selectedCategory, setSelectedCategory } = useTempStore()

  const onSelectCategory = (category: Category) => {
    setSelectedCategory(category)
    router.back()
  }

  return (
    <Page title="Select Category" back withHeader>
      <SelectCategory callback={onSelectCategory} value={selectedCategory} />
    </Page>
  )
}
