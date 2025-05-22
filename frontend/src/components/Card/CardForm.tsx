import { useState } from 'react'
import styled from 'styled-components'
import { useDispatch } from 'react-redux'
import { addCard, editCard } from '../../store/slices/cardSlice'
import { type Card, ColumnType } from '../../types'
import { type AppDispatch } from '../../store'
import Button from '../common/Button'

interface CardFormProps {
  boardId?: string
  column?: ColumnType
  card?: Card
  onCancel?: () => void
  onComplete?: () => void
}

const FormContainer = styled.form`
  background: white;
  border-radius: 4px;
  padding: 12px;
  margin-bottom: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`

const TextInput = styled.input`
  width: 100%;
  padding: 8px;
  margin-bottom: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
`

const TextArea = styled.textarea`
  width: 100%;
  padding: 8px;
  margin-bottom: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-height: 60px;
  resize: vertical;
`

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`

const CardForm = ({
  boardId,
  column = ColumnType.TODO,
  card,
  onCancel,
  onComplete,
}: CardFormProps) => {
  const [title, setTitle] = useState(card?.title || '')
  const [description, setDescription] = useState(card?.description || '')
  const dispatch = useDispatch<AppDispatch>()

  const isEditMode = !!card

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) return

    try {
      if (isEditMode && card) {
        await dispatch(
          editCard({
            cardId: card._id,
            updates: { title, description },
          })
        ).unwrap()
      } else if (boardId) {
        await dispatch(
          addCard({
            title,
            description,
            boardId,
            column,
          })
        ).unwrap()

        // Reset form after adding
        setTitle('')
        setDescription('')
      }

      if (onComplete) onComplete()
    } catch (err) {
      console.error('Failed to save card:', err)
    }
  }

  return (
    <FormContainer onSubmit={handleSubmit}>
      <TextInput
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
      />
      <TextArea
        placeholder="Description..."
        value={description}
        onChange={e => setDescription(e.target.value)}
      />
      <ButtonGroup>
        {onCancel && (
          <Button type="button" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit">{isEditMode ? 'Save' : 'Add Card'}</Button>
      </ButtonGroup>
    </FormContainer>
  )
}

export default CardForm
