import AsyncStorage from '@react-native-async-storage/async-storage'

const storeData = async (key: string, value: any) => {
  try {
    if (!value) return await AsyncStorage.removeItem(key)
    await AsyncStorage.setItem(key, value)
  } catch {
    alert('storeData error for ' + key)
  }
}

const storeDataObj = async (key: string, value: any) => {
  try {
    const jsonValue = JSON.stringify(value)
    await AsyncStorage.setItem(key, jsonValue)
  } catch {
    alert('storeDataObj error for ' + key)
  }
}

const getData = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key)
    if (value !== null) {
      return value
    }
  } catch {
    alert('getData error for ' + key)
  }
}

const getDataMany = async (keys: string[]) => {
  try {
    const value = await AsyncStorage.multiGet(keys)
    if (value !== null) {
      return value
    }
  } catch {
    alert('getData error for ' + keys)
  }
}

const getDataManyObj = async (keys: string[]) => {
  try {
    const value = await AsyncStorage.multiGet(keys)
    if (value !== null) {
      return value.map(([k, v]) => [k, v != null ? JSON.parse(v) : null])
    }
  } catch {
    alert('getData error for ' + keys)
  }
}

const getDataObj = async (key: string) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key)
    return jsonValue != null ? JSON.parse(jsonValue) : null
  } catch {
    alert('getDataObj error for ' + key)
  }
}
export {
  storeData,
  storeDataObj,
  getData,
  getDataMany,
  getDataManyObj,
  getDataObj,
}
