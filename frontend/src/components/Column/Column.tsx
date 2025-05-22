import styled from 'styled-components'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { type Card as CardType, ColumnType } from '../../types'
import SortableCard from '../Card/SortableCard'
import CardForm from '../Card/CardForm'

interface ColumnProps {
  title: string
  columnId: ColumnType
  cards: CardType[]
  boardId: string
}

const ColumnContainer = styled.div`
  background-color: #f0f0f0;
  border-radius: 5px;
  min-height: 500px;
  display: flex;
  flex-direction: column;
  position: relative;
`

const ColumnHeader = styled.h3`
  padding: 10px;
  text-align: center;
  border-bottom: 1px solid #ddd;
  margin: 0;
`

const CardList = styled.div<{ $isDraggingOver: boolean }>`
  padding: 10px;
  flex: 1;
  min-height: 100px;
  background-color: ${props => (props.$isDraggingOver ? '#e0e0e0' : '#f0f0f0')};
  transition: background-color 0.2s ease;
`

const AddCardContainer = styled.div`
  margin-top: 10px;
  padding: 10px;
`

const Column = ({ title, columnId, cards, boardId }: ColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: columnId,
    data: { type: 'column', columnId },
  })

  return (
    <ColumnContainer>
      <ColumnHeader>{title}</ColumnHeader>
      <SortableContext
        items={cards.map(card => card._id)}
        strategy={verticalListSortingStrategy}>
        <CardList ref={setNodeRef} $isDraggingOver={isOver}>
          {cards.map(card => (
            <SortableCard key={card._id} card={card} />
          ))}
        </CardList>
      </SortableContext>
      {columnId === ColumnType.TODO && (
        <AddCardContainer>
          <CardForm boardId={boardId} column={columnId} />
        </AddCardContainer>
      )}
    </ColumnContainer>
  )
}

export default Column
