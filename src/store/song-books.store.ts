import { defineStore } from 'pinia'
import type { Book, BookCollection, BookResourceCollection, Language } from '@/store'
import { storageRef, useLoggerStore } from '@/store'

const STORAGE_ID_COLLECTIONS = 'song-number-settings-collection'
const STORAGE_ID_DOWNLOADS = 'song-number-settings-downloads'
const { VITE_DOWNLOADS } = import.meta.env

export const useSongBooksStore = defineStore('SongBooksStore', () => {
  const log = useLoggerStore()
  const endpoint = storageRef(STORAGE_ID_DOWNLOADS, VITE_DOWNLOADS)
  const collections = storageRef<BookCollection[]>(STORAGE_ID_COLLECTIONS, [])
  const getJson = async <T>(url: string): Promise<T | undefined> => {
    try {
      const res = await fetch(url)
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}: ${url}`)
      return await res.json()
    } catch (err) {
      log.error((err as Error).message)
    }
  }
  const defaultCover = () => getJson<Book>('/json/cover.json')
  const getLanguages = () => getJson<Language[]>(`${endpoint.value}/languages.json`)
  const getIndex = (lang: string) => getJson<BookResourceCollection[]>(`${endpoint.value}/index/${lang}/collections.json`)
  const getCollections = (paths: string[]) =>
    Promise.all(paths.map(path => getJson<BookCollection[]>(`${endpoint.value}${path}`))).then(v => v.flatMap(c => c || []))
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
