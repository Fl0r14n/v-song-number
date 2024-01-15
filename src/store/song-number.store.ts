import { defineStore, storeToRefs } from 'pinia'
import { Book, ChromeCastState, Digit, storageRef, useChromeCastStore } from '.'
import { computed } from 'vue'

const STORAGE_ID_DIGITS = 'song-number-settings-digits'
const STORAGE_ID_NOTES = 'song-number-settings-notes'
const STORAGE_ID_BOOK = 'song-number-settings-book'
const STORAGE_ID_INFO = 'song-number-settings-info'

enum MessageType {
  READ,
  SONG,
  INFO,
  CLEAR
}

export interface PresentButton {
  icon: string
  color: string
  disabled: boolean
  presenting: boolean
}

const isInitialized = (state: ChromeCastState) => (state & ChromeCastState.INITIALIZED) === ChromeCastState.INITIALIZED
const isConnected = (state: ChromeCastState) => (state & ChromeCastState.CONNECTED) === ChromeCastState.CONNECTED

export const useSongNumberStore = defineStore('SongNumberStore', () => {
  const chromeCastStore = useChromeCastStore()
  const { send, close, open } = chromeCastStore
  const { message, state } = storeToRefs(chromeCastStore)
  const connected = computed(() => state.value === ChromeCastState.CONNECTED)
  const presenting = computed(() => connected.value && (message.value.type === MessageType.SONG || message.value.type === MessageType.INFO))
  const presentButton = computed(
    () =>
      ({
        presenting: presenting.value,
        disabled: !connected.value,
        icon: (presenting.value && 'square') || 'play',
        color: (presenting.value && 'danger') || 'primary'
      }) as PresentButton
  )
  const castButton = computed(() => ({
    disabled: !isInitialized(state.value),
    color: (isConnected(state.value) && 'secondary') || 'primary',
    icon: 'icon/cast-icon.svg'
  }))
  const presentedButton = computed(() => ({
    disabled: !isConnected(state.value),
    color: 'secondary',
    icon: 'information'
  }))
  const digits = storageRef<Digit[]>(STORAGE_ID_DIGITS, [
    {
      pos: 0,
      val: 0
    },
    {
      pos: 1,
      val: 0
    },
    {
      pos: 2,
      val: 0
    }
  ])
  const digitsLength = computed({
    get: () => digits.value.length || 0,
    set: size => {
      const value = []
      for (let i = 0; i < size; i++) {
        value.push({
          pos: i,
          val: 0
        })
      }
      digits.value = value
    }
  })
  const number = computed(() => {
    let result = ''
    let leadingZeros = true
    for (const digit of digits.value) {
      if (digit.val !== 0) {
        leadingZeros = false
        result += digit.val
      } else if (!leadingZeros) {
        result += digit.val
      }
    }
    return result
  })
  const info = storageRef(STORAGE_ID_INFO, '')
  const notes = storageRef(STORAGE_ID_NOTES, '')
  const book = storageRef<Book>(STORAGE_ID_BOOK, {})
  const clear = () => send({ type: MessageType.CLEAR })
  const cast = () => {
    if (isConnected(state.value)) {
      close()
    } else {
      open()
    }
  }
  const readPresented = () => send({ type: MessageType.READ })
  const presentInfo = (clr?: boolean) => {
    if (clr) {
      clear()
      return
    }
    send({ type: MessageType.INFO, message: info.value })
  }
  const presentNumber = (clr?: boolean) => {
    if (clr) {
      clear()
      return
    }
    send({ type: MessageType.SONG, number: number.value, book: book.value, notes: notes.value })
  }
  return {
    connected,
    presenting,
    presentButton,
    castButton,
    presentedButton,
    info,
    notes,
    book,
    digits,
    message,
    clear,
    cast,
    readPresented,
    presentInfo,
    presentNumber,
    digitsLength,
    number
  }
})
