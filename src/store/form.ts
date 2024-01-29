import { computed, ref } from 'vue'
import { InputCustomEvent } from '@ionic/vue'

export type ValidationRule = (value?: string) => boolean
export type FormValidationRules<T> = {
  [K in keyof T]?: ValidationRule[]
}

export interface ReactiveForm<T> {
  form: T & { [x: string]: any }
  rules?: FormValidationRules<T>
}

export const useForm = <T>(value: ReactiveForm<T>) => {
  const form = ref(value.form)
  const rules = value.rules
  const getRules = (field: keyof T) => rules?.[field] as ValidationRule[]
  const valid = computed(() =>
    Object.keys(rules || {})
      .map(key =>
        getRules(key as keyof T)
          .map(v => v(form.value[key]))
          .reduce((p, n) => p && n, true)
      )
      .reduce((p, c) => p && c, false)
  )
  //TODO
  const classes = computed(() => ({}))
  const touch = (ev: InputCustomEvent<FocusEvent>) => ev.target?.classList.add('ion-touched')
  return {
    form,
    rules,
    valid,
    touch,
    getRules,
    classes
  }
}

export const requiredRule = (): ValidationRule => value => !!value
export const minLengthRule =
  (min: number): ValidationRule =>
  value =>
    !value || value.length >= min
