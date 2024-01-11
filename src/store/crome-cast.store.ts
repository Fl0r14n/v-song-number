import { defineStore } from 'pinia'
import { loadScript, useLoggerStore } from '.'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

declare global {
  interface Window {
    chrome?: {
      cast?: any

      [key: string]: any
    }
  }
}

export enum ChromeCastState {
  DISABLED = 0, // no cast api
  INITIALIZED = 1, // cast api initialized
  AVAILABLE = 3, // at least one receiver on the network
  CONNECTED = 7 // connected to receiver
}

const APPLICATION_ID = '20CAA3A2'
const NAMESPACE = 'urn:x-cast:ro.biserica2.cast.songnumber'
const CAST_SCRIPT = 'https://www.gstatic.com/cv/js/sender/v1/cast_sender.js'

export const useChromeCastStore = defineStore('ChromeCastStore', () => {
  const log = useLoggerStore()
  const { t } = useI18n()
  const state = ref(ChromeCastState.DISABLED)
  const session = ref()
  const event = ref()
  const message = computed(() => (event.value && JSON.parse(event.value)) || undefined)

  const init = () => {
    const { cast } = globalThis.window?.chrome || {}
    if (cast) {
      const { ApiConfig, SessionRequest, ReceiverAvailability, initialize } = cast
      const apiConfig = new ApiConfig(new SessionRequest(APPLICATION_ID), onSession, (status: any) => {
        switch (status) {
          case ReceiverAvailability.UNAVAILABLE: {
            state.value = ChromeCastState.INITIALIZED
            // close session if existed
            close(ChromeCastState.INITIALIZED)
            log.warn(t('providers.chromecast.receiverNotFound'))
            break
          }
          case ReceiverAvailability.AVAILABLE: {
            if (!session.value) {
              state.value = ChromeCastState.AVAILABLE
            }
            log.debug(t('providers.chromecast.receiverFound'))
            break
          }
          default: {
            state.value = ChromeCastState.DISABLED
          }
        }
      })
      initialize(
        apiConfig,
        () => (state.value = ChromeCastState.INITIALIZED),
        (err: any) => {
          state.value = ChromeCastState.DISABLED
          log.error(`${t('providers.chromecast.error')}${err.description}`)
        }
      )
    }
  }

  const open = () => {
    const { cast } = globalThis.window?.chrome || {}
    state.value === ChromeCastState.AVAILABLE && cast.requestSession(onSession)
  }

  const close = (s?: ChromeCastState) => {
    session.value?.stop(
      () => {
        log.debug(t('providers.chromecast.stop'))
        session.value = undefined
        state.value = s || ChromeCastState.AVAILABLE
      },
      (err: any) => {
        log.error(`${t('providers.chromecast.error')}${err.description}`)
        session.value = undefined
        state.value = s || ChromeCastState.AVAILABLE
      }
    )
  }

  const onSession = (s: any) => {
    log.debug(`${t('providers.chromecast.newSession')}${s.sessionId}`)
    s.addUpdateListener((isAlive: boolean) => {
      log.debug(`${t('providers.chromecast.' + ((isAlive && 'sessionUpdated') || 'sessionRemoved'))}: ${s.sessionId}`)
      !isAlive && close()
    })
    s.addMessageListener(NAMESPACE, (ns: string, e: any) => {
      // message received
      log.debug(`${t('providers.chromecast.messageReceived')}${e}`)
      event.value = e
    })
    session.value = s
    state.value = ChromeCastState.CONNECTED
  }

  watch(
    state,
    async s => {
      if (s === ChromeCastState.DISABLED && !globalThis.window?.chrome) {
        await loadScript({ src: CAST_SCRIPT })
      }
    },
    { immediate: true }
  )

  return {
    init,
    open,
    close,
    message,
    state
  }
})
