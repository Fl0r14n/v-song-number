import { defineStore } from 'pinia'
import { storageRef } from '@/store/ref'
import { toastController } from '@ionic/vue'

const STORAGE_ID_DEBUG = 'song-number-settings-log-level'

export enum LogLevel {
  INFO,
  WARN,
  ERROR,
  DEBUG
}

const toast = async (msg: any, cssClass?: string) => {
  const toastSettings: any = {
    message: msg,
    duration: 3000
  }
  if (cssClass) {
    toastSettings.cssClass = cssClass
  }
  const toast = await toastController.create(toastSettings)
  return toast.present()
}

export const useLoggerStore = defineStore('LoggerStore', () => {
  const logLevel = storageRef(STORAGE_ID_DEBUG, LogLevel.INFO, value => Number(value))
  const info = async (message: any) => toast(message, 'toast-info')
  const warn = async (message: any) => logLevel.value >= LogLevel.WARN && toast(message, 'toast-warn')
  const error = async (message: any) => logLevel.value >= LogLevel.ERROR && toast(message, 'toast-error')
  const debug = async (message: any) => logLevel.value >= LogLevel.DEBUG && toast(message, 'toast-debug')

  return {
    logLevel,
    info,
    warn,
    error,
    debug
  }
})
