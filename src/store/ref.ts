import { Preferences } from '@capacitor/preferences'
import { ref, watch } from 'vue'

const get = async (key: string) => {
  const { value } = await Preferences.get({ key })
  return (value && JSON.parse(value)) || undefined
}

const set = (key: string, value: any) => Preferences.set({ key, value: JSON.stringify(value) })

export const storageRef = <T>(key: string, initial?: T, map?: (v: any) => T) => {
  const model = ref<T>((map && map(initial)) || (initial as T))
  get(key).then(v => {
    model.value = (map && map(v || initial)) || v || initial
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
