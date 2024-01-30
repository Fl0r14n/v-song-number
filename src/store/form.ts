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
  const rules = ref(value.rules)
  const getRules = (field: keyof T) => (rules.value as any)?.[field] as ValidationRule[] | undefined
  const isValid = (field: keyof T) =>
    getRules(field)
      ?.map(v => v(form.value[field as string]))
      .reduce((p, n) => p && n, true)
  const getClass = (field: keyof T) => {
    const valid = isValid(field)
    return (
      (valid !== undefined && {
        'ion-valid': valid,
        'ion-invalid': !valid
      }) ||
      {}
    )
  }
  const valid = computed(() =>
    Object.keys(rules.value || {})
      .map(key => isValid(key as keyof T))
      .reduce((p, c) => p && c, true)
  )
  const classes = computed(() =>
    Object.keys(form.value)
      .map(key => ({ [key]: getClass(key as keyof T) }))
      .reduce((p, c) => ({ ...p, ...c }), {} as { [K in keyof T]: object })
  )
  const touch = (ev: InputCustomEvent<FocusEvent>) => ev.target?.classList.add('ion-touched')
  return {
    form,
    rules,
    valid,
    classes,
    touch,
    isValid,
    getClass
  }
}

export const requiredRule = (): ValidationRule => value => !!value
export const minLengthRule =
  (min: number): ValidationRule =>
  value =>
    !value || value.length >= min
