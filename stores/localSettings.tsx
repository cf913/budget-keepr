import {Loader} from '@/components/Loader'
import {getDataManyObj, storeDataObj} from '@/utils/async-storage'
import {SplashScreen} from 'expo-router'
import React, {useEffect, useMemo, useState} from 'react'

export interface Budget {
  id: string
  name: string
}

const LocalSettingsContext = React.createContext<{
  defaultBudget: Budget | null
  setDefaultBudget: (budget: Budget | null) => Promise<void>
  loadingSettings: boolean
  resetState: () => Promise<void>
}>({
  defaultBudget: null,
  setDefaultBudget: async () => {},
  loadingSettings: true,
  resetState: async () => {},
})

export function useLocalSettings() {
  const value = React.useContext(LocalSettingsContext)
  if (process.env.NODE_ENV !== 'production') {
    if (!value) {
      throw new Error(
        'useLocalSettings must be wrapped in a <LocalSettingsProvider />',
      )
    }
  }
  return value
}

export function LocalSettingsProvider(props: React.PropsWithChildren) {
  const [defaultBudget, setStateDefaultBudget] = useState<Budget | null>(null)
  const [loadingSettings, setLoadingSettings] = useState(true)

  const KEYS: any = useMemo(
    () => ({
      DEFAULT_BUDGET: {
        key: 'DEFAULT_BUDGET',
        setter: setStateDefaultBudget,
      },
    }),
    [setStateDefaultBudget],
  )

  useEffect(() => {
    const load = async () => {
      const values = await getDataManyObj([KEYS.DEFAULT_BUDGET.key])
      if (values) {
        const nextValues = values.map(([k, v]) => {
          KEYS[k].setter(v)
        })
        console.log('values', nextValues)
      }
      // DONE, READY TO LOAD APP CONTENT
      setLoadingSettings(false)
      await new Promise((res, rej) => setTimeout(res, 1000))
      SplashScreen.hideAsync()
    }

    load()
  }, [KEYS])

  const setDefaultBudget = async (budget: Budget | null) => {
    setStateDefaultBudget(budget ?? null)
    await storeDataObj(KEYS.DEFAULT_BUDGET.key, budget)
    return
  }

  const resetState = async () => {
    setStateDefaultBudget(null)
    await storeDataObj(KEYS.DEFAULT_BUDGET.key, null)
    return
  }

  return (
    <LocalSettingsContext.Provider
      value={{
        defaultBudget,
        setDefaultBudget,
        loadingSettings,
        resetState,
      }}
    >
      {loadingSettings ? <Loader /> : props.children}
    </LocalSettingsContext.Provider>
  )
}
