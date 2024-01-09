import { Preferences } from '@capacitor/preferences'
import { customRef } from 'vue'

const get = async (key: string) => {
  const { value } = await Preferences.get({ key })
  return (value && JSON.parse(value)) || undefined
}

const set = (key: string, value: any) => Preferences.set({ key, value: JSON.stringify(value) })

export const storageRef = <T>(key: string, initial?: T, map?: (v: any) => T) => {
  let value: T
  get(key).then(v => (value = (map && map(v || initial)) || v || initial))
  return customRef<T>((track, trigger) => ({
    get: () => {
      track()
      return value
    },
    set: newValue =>
      set(key, newValue).then(() => {
        value = newValue
        trigger()
      })
  }))
}
