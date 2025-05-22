import { Request, Response } from 'express'
import { Card, ColumnType } from '../models/card.model'

export const getCardsByBoardId = async (req: Request, res: Response) => {
  try {
    const { boardId } = req.params

    const cards = await Card.find({ boardId }).sort({ column: 1, order: 1 })

    res.json(cards)
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving cards',
      error: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}

export const createCard = async (req: Request, res: Response) => {
  try {
    const { title, description, boardId, column = ColumnType.TODO } = req.body

    if (!title || !boardId) {
      res.status(400).json({ message: 'Title and boardId are required' })
      return
    }

    // Find the highest order in the column
    const maxOrderCard = await Card.findOne({ boardId, column })
      .sort({ order: -1 })
      .limit(1)

    const order = maxOrderCard ? maxOrderCard.order + 1 : 0

    const card = await Card.create({
      title,
      description,
      boardId,
      column,
      order,
    })

    res.status(201).json(card)
  } catch (error) {
    res.status(500).json({
      message: 'Error creating card',
      error: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}

export const updateCard = async (req: Request, res: Response) => {
  try {
    const { title, description, column } = req.body

    const card = await Card.findByIdAndUpdate(
      req.params.id,
      { title, description, column },
      { new: true }
    )

    if (!card) {
      res.status(404).json({ message: 'Card not found' })
      return
    }

    res.json(card)
  } catch (error) {
    res.status(500).json({
      message: 'Error updating card',
      error: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}

export const deleteCard = async (req: Request, res: Response) => {
  try {
    const card = await Card.findByIdAndDelete(req.params.id)

    if (!card) {
      res.status(404).json({ message: 'Card not found' })
      return
    }

    res.json({ message: 'Card removed' })
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting card',
      error: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}

export const reorderCards = async (req: Request, res: Response) => {
  try {
    const { cardId, destinationColumn, destinationIndex } = req.body

    if (!cardId || !destinationColumn || !destinationIndex) {
      res.status(400).json({ message: 'Required parameters missing' })
      return
    }

    // Find the card that was dragged
    const movedCard = await Card.findById(cardId)

    if (!movedCard) {
      res.status(404).json({ message: 'Card not found' })
      return
    }

    // Get source information from the card itself
    const sourceColumn = movedCard.column
    const sourceIndex = movedCard.order
    const boardId = movedCard.boardId

    // Skip processing if nothing changed
    if (sourceColumn === destinationColumn && sourceIndex === destinationIndex) {
      res.json(await Card.find({ boardId }).sort({ column: 1, order: 1 }))
      return
    }

    // Update cards in source column
    if (sourceColumn === destinationColumn) {
      // Same column reordering
      if (sourceIndex < destinationIndex) {
        // Moving down
        await Card.updateMany(
          {
            boardId,
            column: sourceColumn,
            order: { $gt: sourceIndex, $lte: destinationIndex },
          },
          { $inc: { order: -1 } }
        )
      } else if (sourceIndex > destinationIndex) {
        // Moving up
        await Card.updateMany(
          {
            boardId,
            column: sourceColumn,
            order: { $lt: sourceIndex, $gte: destinationIndex },
          },
          { $inc: { order: 1 } }
        )
      }
    } else {
      // Moving between columns
      // Decrease order of all cards after source index in source column
      await Card.updateMany(
        {
          boardId,
          column: sourceColumn,
          order: { $gt: sourceIndex },
        },
        { $inc: { order: -1 } }
      )

      // Increase order of all cards at and after destination index in destination column
      await Card.updateMany(
        {
          boardId,
          column: destinationColumn,
          order: { $gte: destinationIndex },
        },
        { $inc: { order: 1 } }
      )
    }

    // Update the moved card
    movedCard.column = destinationColumn
    movedCard.order = destinationIndex
    await movedCard.save()

    // Get updated cards for the board
    const updatedCards = await Card.find({ boardId }).sort({ column: 1, order: 1 })
    res.json(updatedCards)
  } catch (error) {
    res.status(500).json({
      message: 'Error reordering cards',
      error: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}
