export enum ColumnType {
  TODO = 'todo',
  IN_PROGRESS = 'inProgress',
  DONE = 'done',
}

export interface Card {
  _id: string
  title: string
  description?: string
  boardId: string
  column: ColumnType
  order: number
}

export interface Board {
  _id: string
  name: string
}

export interface CardsState {
  cards: Card[]
  loading: boolean
  error: string | null
}

export interface BoardState {
  currentBoard: Board | null
  loading: boolean
  error: string | null
}
