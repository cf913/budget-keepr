import {Loader} from '@/components/Loader'
import {getData, getDataMany, storeData} from '@/utils/async-storage'
import {SplashScreen} from 'expo-router'
import React, {useEffect, useState} from 'react'

const LocalSettingsContext = React.createContext<{
  defaultBudgetId: string | null
  setDefaultBudgetId: (id?: string) => Promise<void>
  loadingSettings: boolean
}>({
  defaultBudgetId: null,
  setDefaultBudgetId: async () => {},
  loadingSettings: true,
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
  const [defaultBudgetId, setStateDefaultBudgetId] = useState<string | null>(
    null,
  )
  const [loadingSettings, setLoadingSettings] = useState(true)

  const KEYS: any = {
    DEFAULT_BUDGET_ID: {
      key: 'DEFAULT_BUDGET_ID',
      setter: setStateDefaultBudgetId,
    },
  }

  useEffect(() => {
    const load = async () => {
      const values = await getDataMany([KEYS.DEFAULT_BUDGET_ID.key])
      if (values) {
        values.map(([k, v]) => {
          KEYS[k].setter(v)
        })
      }
      // DONE, READY TO LOAD APP CONTENT
      setLoadingSettings(false)
      await new Promise((res, rej) => setTimeout(res, 1000))
      SplashScreen.hideAsync()
    }

    load()
  }, [])

  const setDefaultBudgetId = async (id?: string) => {
    setStateDefaultBudgetId(id ?? null)
    await storeData(KEYS.DEFAULT_BUDGET_ID.key, id)
    return
  }

  return (
    <LocalSettingsContext.Provider
      value={{
        defaultBudgetId,
        setDefaultBudgetId,
        loadingSettings,
      }}
    >
      {loadingSettings ? <Loader /> : props.children}
    </LocalSettingsContext.Provider>
  )
}
