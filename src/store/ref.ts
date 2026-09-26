import { Preferences } from '@capacitor/preferences'
import { ref, watch } from 'vue'

const get = async (key: string) => {
  try {
    const { value } = await Preferences.get({ key })
    return (value && JSON.parse(value)) || undefined
  } catch (err) {
    // corrupted or unreadable value: fall back to the initial one (it gets overwritten on the next change)
    console.warn(`storage: ignoring value of ${key}`, err)
    return undefined
  }
}

const set = (key: string, value: any) => Preferences.set({ key, value: JSON.stringify(value) })

export const storageRef = <T>(key: string, initial?: T, map?: (v: any) => T) => {
  const model = ref<T>(map?.(initial) || (initial as T))
  get(key).then(v => {
    model.value = map?.(v || initial) || v || initial
    // start watching after we get the value from storage
    watch(
      model,
      async m => {
        await set(key, m)
      },
      { deep: true }
    )
  })
  return model
}
