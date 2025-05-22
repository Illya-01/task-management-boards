import axios from 'axios'
import { type Board, type Card, ColumnType } from '../types'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Board API functions
export const createBoard = async (name: string): Promise<Board> => {
  const response = await axios.post(`${API_URL}/boards`, { name })
  return response.data
}

export const getBoardById = async (id: string): Promise<Board> => {
  const response = await axios.get(`${API_URL}/boards/${id}`)
  return response.data
}

// Card API functions
export const getCardsByBoardId = async (boardId: string): Promise<Card[]> => {
  const response = await axios.get(`${API_URL}/cards/board/${boardId}`)
  return response.data
}

export const createCard = async (
  title: string,
  description: string,
  boardId: string,
  column: ColumnType = ColumnType.TODO
): Promise<Card> => {
  const response = await axios.post(`${API_URL}/cards`, {
    title,
    description,
    boardId,
    column,
  })
  return response.data
}

export const updateCard = async (
  cardId: string,
  updates: Partial<Card>
): Promise<Card> => {
  const response = await axios.put(`${API_URL}/cards/${cardId}`, updates)
  return response.data
}

export const deleteCard = async (cardId: string): Promise<void> => {
  await axios.delete(`${API_URL}/cards/${cardId}`)
}

export const reorderCards = async (
  cardId: string,
  destinationColumn: ColumnType,
  destinationIndex: number
): Promise<Card[]> => {
  const payload = {
    cardId,
    destinationColumn,
    destinationIndex,
  }

  console.log('Reorder cards payload:', payload)

  try {
    const response = await axios.put(`${API_URL}/cards/reorder`, payload)
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error('Reorder cards error:', error.response.data)
    } else {
      console.error('Reorder cards error:', error)
    }
    throw error
  }
}
