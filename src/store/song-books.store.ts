import { defineStore } from 'pinia'
import { storageRef } from '@/store/ref'
import axios from 'axios'
import { useLoggerStore } from '@/store/logger.store'
import { BookCollection, BookResourceCollection, Language } from '.'

const STORAGE_ID_COLLECTIONS = 'song-number-settings-collection'
const STORAGE_ID_DOWNLOADS = 'song-number-settings-downloads'
const { VITE_DOWNLOADS } = import.meta.env

export const useSongBooksStore = defineStore('SongBooksStore', () => {
  const log = useLoggerStore()
  const endpoint = storageRef(STORAGE_ID_DOWNLOADS, VITE_DOWNLOADS)
  const collections = storageRef<BookCollection[]>(STORAGE_ID_COLLECTIONS, [])
  const defaultCover = () => axios.get('assets/json/cover.json')
  const getLanguages = () =>
    axios
      .get<Language[]>(`${endpoint.value}/languages.json`)
      .catch(err => {
        log.error(err.response.message)
        return err.response
      })
      .then(r => r.data)
  const getIndex = (lang: string) =>
    axios
      .get<BookResourceCollection[]>(`${endpoint.value}/index/${lang}/collections.json`)
      .catch(err => {
        log.error(err.response.message)
        return err.response
      })
      .then(r => r.data)
  const getCollections = (paths: string[]) =>
    Promise.all(
      paths.map(path =>
        axios
          .get<BookCollection[]>(`${endpoint.value}${path}`)
          .catch(err => {
            log.error(err.response.message)
            return err.response
          })
          .then(r => r.data)
      )
    ).then(v => v.reduce((a, b) => [...a, ...b]))

  return {
    endpoint,
    getLanguages,
    getIndex,
    getCollections,
    collections,
    defaultCover
  }
})
