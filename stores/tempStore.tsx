import { Frequency } from '@/components/RecurringInputs'
import React from 'react'

const TempStoreContext = React.createContext<{
  selectedFrequency: Frequency,
  setSelectedFrequency: (frequency: Frequency) => void
}>({
  selectedFrequency: 'monthly',
  setSelectedFrequency: () => { },
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

  return (
    <TempStoreContext.Provider
      value={{
        selectedFrequency,
        setSelectedFrequency,
      }}
    >
      {children}
    </TempStoreContext.Provider>
  )
}
