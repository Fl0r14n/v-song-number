import { toRaw } from 'vue'

const keys = new WeakMap<object, number>()
let next = 0

// stable v-for key per object, for lists that can be reordered and may hold duplicate names
export const objectKey = (o: object) => {
  const raw = toRaw(o)
  let key = keys.get(raw)
  if (key === undefined) {
    key = ++next
    keys.set(raw, key)
  }
  return key
}
