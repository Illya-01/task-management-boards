import { useState } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'
import { removeCard } from '../../store/slices/cardSlice'
import { type Card as CardType } from '../../types'
import CardForm from './CardForm'
import { type AppDispatch } from '../../store'

// Import icons
import { FiEdit2, FiTrash2 } from 'react-icons/fi'

interface CardProps {
  card: CardType
}

const CardContainer = styled.div`
  background-color: white;
  border-radius: 4px;
  padding: 12px;
  margin-bottom: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
`

const CardTitle = styled.h4`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
`

const CardDescription = styled.p`
  margin: 0;
  font-size: 14px;
  color: #666;
`

const CardActions = styled.div`
  display: flex;
  gap: 8px;
`

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    opacity: 0.7;
  }
`

const Card = ({ card }: CardProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const dispatch = useDispatch<AppDispatch>()

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this card?')) {
      dispatch(removeCard(card._id))
    }
  }

  if (isEditing) {
    return (
      <CardForm
        card={card}
        onCancel={() => setIsEditing(false)}
        onComplete={() => setIsEditing(false)}
      />
    )
  }

  return (
    <CardContainer>
      <CardHeader>
        <CardTitle>{card.title}</CardTitle>
        <CardActions>
          <IconButton onClick={() => setIsEditing(true)} aria-label="Edit">
            <FiEdit2 size={16} />
          </IconButton>
          <IconButton onClick={handleDelete} aria-label="Delete">
            <FiTrash2 size={16} />
          </IconButton>
        </CardActions>
      </CardHeader>
      <CardDescription>{card.description}</CardDescription>
    </CardContainer>
  )
}

export default Card
