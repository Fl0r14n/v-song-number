export type Digit = {
  pos: number
  val: number
}

export type Book = {
  title?: string
  description?: string
  thumb?: string
}

export type Language = {
  code?: string
  name?: string
}

export type BookResourceCollection = {
  name?: string
  description?: string
  thumb?: string
  paths: string[]
  selected?: boolean
}

export type BookCollection = {
  name?: string
  books?: Book[]
  reorder?: boolean
}

// books are persisted and re-imported, so compare by content rather than object identity
export const isSameBook = (a?: Book, b?: Book) => !!a && !!b && a.title === b.title && a.description === b.description
