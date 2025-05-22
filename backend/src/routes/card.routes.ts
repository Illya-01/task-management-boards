import express from 'express'
import {
  getCardsByBoardId,
  createCard,
  updateCard,
  deleteCard,
  reorderCards,
} from '../controllers/card.controller'

const router = express.Router()

router.put('/reorder', reorderCards)
router.get('/board/:boardId', getCardsByBoardId)

router.post('/', createCard)
router.put('/:id', updateCard)
router.delete('/:id', deleteCard)

export default router
