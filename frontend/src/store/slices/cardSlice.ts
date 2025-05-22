import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { Card, CardsState, ColumnType } from '../../types'
import {
  getCardsByBoardId,
  createCard,
  updateCard,
  deleteCard,
  reorderCards,
} from '../../api/boardApi'

const initialState: CardsState = {
  cards: [],
  loading: false,
  error: null,
}

export const fetchCards = createAsyncThunk(
  'cards/fetchCards',
  async (boardId: string) => {
    const cards = await getCardsByBoardId(boardId)
    return cards
  }
)

export const addCard = createAsyncThunk(
  'cards/addCard',
  async ({
    title,
    description,
    boardId,
    column,
  }: {
    title: string
    description: string
    boardId: string
    column: ColumnType
  }) => {
    const card = await createCard(title, description, boardId, column)
    return card
  }
)

export const editCard = createAsyncThunk(
  'cards/editCard',
  async ({ cardId, updates }: { cardId: string; updates: Partial<Card> }) => {
    const card = await updateCard(cardId, updates)
    return card
  }
)

export const removeCard = createAsyncThunk(
  'cards/removeCard',
  async (cardId: string) => {
    await deleteCard(cardId)
    return cardId
  }
)

// Keep track of pending reorder operations
const pendingMoveOperations = new Map()

export const moveCard = createAsyncThunk(
  'cards/moveCard',
  async (
    {
      cardId,
      destinationColumn,
      destinationIndex,
    }: {
      cardId: string
      destinationColumn: ColumnType
      destinationIndex: number
    },
    { rejectWithValue }
  ) => {
    const operationKey = `${cardId}:${destinationColumn}:${destinationIndex}`

    // If this exact operation is already in progress, reject it
    if (pendingMoveOperations.has(operationKey)) {
      return rejectWithValue('Operation already in progress')
    }

    // Create a promise for this operation
    const operationPromise = (async () => {
      try {
        const cards = await reorderCards(cardId, destinationColumn, destinationIndex)
        return cards
      } finally {
        // Clean up after a delay to prevent immediate re-triggering
        setTimeout(() => {
          pendingMoveOperations.delete(operationKey)
        }, 500)
      }
    })()

    // Store the promise
    pendingMoveOperations.set(operationKey, operationPromise)

    // Wait for it to complete and return the result
    return await operationPromise
  }
)

const cardSlice = createSlice({
  name: 'cards',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      // Fetch cards cases
      .addCase(fetchCards.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCards.fulfilled, (state, action) => {
        state.cards = action.payload
        state.loading = false
      })
      .addCase(fetchCards.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch cards'
      })
      // Add card cases
      .addCase(addCard.fulfilled, (state, action) => {
        state.cards.push(action.payload)
      })
      // Edit card cases
      .addCase(editCard.fulfilled, (state, action) => {
        const index = state.cards.findIndex(card => card._id === action.payload._id)
        if (index !== -1) {
          state.cards[index] = action.payload
        }
      })
      // Remove card cases
      .addCase(removeCard.fulfilled, (state, action) => {
        state.cards = state.cards.filter(card => card._id !== action.payload)
      })
      // Move card cases
      .addCase(moveCard.fulfilled, (state, action) => {
        state.cards = action.payload
      })
  },
})

export default cardSlice.reducer
