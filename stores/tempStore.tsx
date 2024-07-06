import { Category } from '@/components/RecentEntries'
import { Frequency } from '@/components/RecurringInputs'
import React from 'react'

const TempStoreContext = React.createContext<{
  selectedFrequency: Frequency,
  setSelectedFrequency: (frequency: Frequency) => void
  selectedCategory: Category | null
  setSelectedCategory: (category: Category | null) => void
}>({
  selectedFrequency: 'monthly',
  setSelectedFrequency: () => { },
  selectedCategory: null,
  setSelectedCategory: () => { },
})

export function useTempStore() {
  const value = React.useContext(TempStoreContext)
  if (process.env.NODE_ENV !== 'production') {
    if (!value) {
      throw new Error('useTempStore must be wrapped in a <TempStoreProvider />')
    }
  }
  return value
}

export function TempStoreProvider({ children }: { children: React.ReactNode }) {
  const [selectedFrequency, setSelectedFrequency] = React.useState<Frequency>('monthly')
  const [selectedCategory, setSelectedCategory] = React.useState<Category | null>(null)

  return (
    <TempStoreContext.Provider
      value={{
        selectedFrequency,
        setSelectedFrequency,
        selectedCategory,
        setSelectedCategory,
      }}
    >
      {children}
    </TempStoreContext.Provider>
  )
}
