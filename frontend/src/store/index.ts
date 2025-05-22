import { configureStore } from '@reduxjs/toolkit'
import boardReducer from './slices/boardSlice'
import cardReducer from './slices/cardSlice'

export const store = configureStore({
  reducer: {
    board: boardReducer,
    cards: cardReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
