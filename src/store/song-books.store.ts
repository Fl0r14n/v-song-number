import { defineStore } from 'pinia'
import { storageRef } from '@/store/ref'
import axios from 'axios'
import { useLoggerStore } from '@/store/logger.store'
import { Book, BookCollection, BookResourceCollection, Language } from '.'

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
  const addBook = (book: Book, collectionName: string) => {
    const collection = collections.value.find(c => c.name === collectionName)
    if (collection) {
      if (!collection.books || collection.books.length === undefined) {
        collection.books = []
      }
      collection.books.push(book)
    }
  }
  const deleteBook = (book: Book, collection: BookCollection) => {
    if (collection.books) {
      const idx = collection.books.findIndex(i => i.title === book.title && i.description === book.description)
      if (idx > -1) {
        collection.books.splice(idx, 1)
      }
    }
  }

  const editBook = (oldBook: Book, newBook: Book) => Object.assign(oldBook, newBook)

  return {
    endpoint,
    getLanguages,
    getIndex,
    getCollections,
    collections,
    defaultCover,
    addBook,
    deleteBook,
    editBook
  }
})
