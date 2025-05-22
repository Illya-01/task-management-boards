import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { type BoardState } from '../../types'
import { createBoard, getBoardById } from '../../api/boardApi'

const initialState: BoardState = {
  currentBoard: null,
  loading: false,
  error: null,
}

export const createNewBoard = createAsyncThunk(
  'board/createBoard',
  async (name: string) => {
    const board = await createBoard(name)
    return board
  }
)

export const fetchBoard = createAsyncThunk(
  'board/fetchBoard',
  async (boardId: string) => {
    const board = await getBoardById(boardId)
    return board
  }
)

const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    clearBoard: state => {
      state.currentBoard = null
    },
  },
  extraReducers: builder => {
    builder
      // Create board cases
      .addCase(createNewBoard.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(createNewBoard.fulfilled, (state, action) => {
        state.currentBoard = action.payload
        state.loading = false
      })
      .addCase(createNewBoard.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to create board'
      })
      // Fetch board cases
      .addCase(fetchBoard.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchBoard.fulfilled, (state, action) => {
        state.currentBoard = action.payload
        state.loading = false
      })
      .addCase(fetchBoard.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch board'
      })
  },
})

export const { clearBoard } = boardSlice.actions
export default boardSlice.reducer
