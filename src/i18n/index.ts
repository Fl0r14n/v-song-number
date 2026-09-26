import { createI18n } from 'vue-i18n'
import { en } from '@/i18n/en'
import { ro } from '@/i18n/ro'

const messages = { en, ro }
type Locale = keyof typeof messages

// device language (e.g. 'ro-RO' -> 'ro'); the WebView reports the phone's system language
const detectLocale = (): Locale => {
  const languages = globalThis.navigator?.languages?.length ? navigator.languages : [globalThis.navigator?.language]
  for (const language of languages) {
    const code = language?.split('-')[0].toLowerCase()
    if (code && code in messages) return code as Locale
  }
  return 'en'
}

export const i18n = createI18n({
  legacy: false,
  locale: detectLocale(),
  fallbackLocale: 'en',
  messages,
  fallbackWarn: false,
  missingWarn: false
})
