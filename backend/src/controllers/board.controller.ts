import { Request, Response } from 'express'
import { Board } from '../models/board.model'

export const createBoard = async (req: Request, res: Response) => {
  try {
    const { name } = req.body

    if (!name) {
      res.status(400).json({ message: 'Board name is required' })
      return
    }

    const board = await Board.create({ name })

    res.status(201).json(board)
  } catch (error) {
    res.status(500).json({
      message: 'Error creating board',
      error: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}

export const getBoardById = async (req: Request, res: Response) => {
  try {
    const board = await Board.findById(req.params.id)

    if (!board) {
      res.status(404).json({ message: 'Board not found' })
      return
    }

    res.json(board)
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving board',
      error: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}

export const updateBoard = async (req: Request, res: Response) => {
  try {
    const { name } = req.body

    if (!name) {
      res.status(400).json({ message: 'Board name is required' })
      return
    }

    const board = await Board.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true }
    )

    if (!board) {
      res.status(404).json({ message: 'Board not found' })
      return
    }

    res.json(board)
  } catch (error) {
    res.status(500).json({
      message: 'Error updating board',
      error: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}

export const deleteBoard = async (req: Request, res: Response) => {
  try {
    const board = await Board.findByIdAndDelete(req.params.id)

    if (!board) {
      res.status(404).json({ message: 'Board not found' })
      return
    }

    res.json({ message: 'Board removed' })
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting board',
      error: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}
