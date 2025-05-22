import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styled from 'styled-components'
import {
  type DragStartEvent,
  type DragEndEvent,
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core'
import type { RootState, AppDispatch } from '../store'
import { moveCard } from '../store/slices/cardSlice'
import { ColumnType, type Card } from '../types'
import BoardForm from '../components/Board/BoardForm'
import BoardLoader from '../components/Board/BoardLoader'
import Column from '../components/Column/Column'
import ErrorMessage from '../components/common/ErrorMessage'
import CardComponent from '../components/Card/Card'

const PageContainer = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`

const BoardTitle = styled.h2`
  margin-top: 20px;
`

const BoardContainer = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(270px, 1fr));
  gap: 20px;
  margin-top: 30px;
`

const BoardId = styled.span`
  font-size: 14px;
  color: #666;
  font-weight: normal;
`

const StyledDragOverlay = styled(DragOverlay)`
  z-index: 9999;

  /* Add enhanced styling for the dragged card */
  & > div {
    transform: scale(1.05);
    box-shadow:
      0 10px 20px rgba(0, 0, 0, 0.19),
      0 6px 6px rgba(0, 0, 0, 0.23);
    cursor: grabbing;
  }
`

const BoardPage = () => {
  const { currentBoard, error: boardError } = useSelector(
    (state: RootState) => state.board
  )
  const { cards, error: cardsError } = useSelector((state: RootState) => state.cards)
  const dispatch = useDispatch<AppDispatch>()

  // State to track the currently dragged card
  const [activeCard, setActiveCard] = useState<Card | null>(null)

  // Configure dnd-kit sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Start dragging after moving 5px
      },
    })
  )

  // Filter cards by column
  const getCardsForColumn = (columnType: ColumnType): Card[] => {
    return cards
      .filter(card => card.column === columnType)
      .sort((a, b) => a.order - b.order)
  }

  // Track drag start to show the card being dragged
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const draggedCard = cards.find(card => card._id === active.id)
    if (draggedCard) {
      setActiveCard(draggedCard)
    }
  }

  // Track drag end to handle card movement
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    // Reset active card
    setActiveCard(null)

    // Exit if no valid drop target
    if (!over) return

    const activeCardId = active.id as string
    const activeCard = cards.find(card => card._id === activeCardId)

    if (!activeCard) {
      console.error('Could not find active card with ID:', activeCardId)
      return
    }

    // Handle dropping on a column
    if (over.data.current?.type === 'column') {
      const destinationColumn = over.id as ColumnType
      const columnCards = getCardsForColumn(destinationColumn)
      const destinationIndex = columnCards.length // Add to the end

      console.log(`Moving card to ${destinationColumn} at index ${destinationIndex}`)

      dispatch(
        moveCard({
          cardId: activeCardId,
          destinationColumn,
          destinationIndex,
        })
      )
      return
    }

    // Handle dropping on a card
    if (over.data.current?.type === 'card') {
      const overCardId = over.id as string
      const overCard = cards.find(card => card._id === overCardId)

      if (!overCard) {
        console.error('Could not find target card with ID:', overCardId)
        return
      }

      const destinationColumn = overCard.column
      const destinationCards = getCardsForColumn(destinationColumn)
      const overCardIndex = destinationCards.findIndex(
        card => card._id === overCardId
      )

      // If the same card, do nothing
      if (activeCardId === overCardId) return

      // Calculate proper insertion index
      let destinationIndex = overCardIndex

      // If in the same column and moving down, we need to account for the removed item
      if (
        activeCard.column === destinationColumn &&
        activeCard.order < overCard.order
      ) {
        destinationIndex = overCardIndex
      } else {
        destinationIndex = overCardIndex
      }

      console.log(
        `Moving card from ${activeCard.column} to ${destinationColumn} at index ${destinationIndex}`
      )

      dispatch(
        moveCard({
          cardId: activeCardId,
          destinationColumn,
          destinationIndex,
        })
      )
    }
  }

  return (
    <PageContainer>
      <h1>Task Management Board</h1>

      <BoardForm />
      <BoardLoader />
      <ErrorMessage message={boardError} />
      <ErrorMessage message={cardsError} />

      {currentBoard && (
        <>
          <BoardTitle>
            {currentBoard.name} <BoardId>(ID: {currentBoard._id})</BoardId>
          </BoardTitle>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}>
            <BoardContainer>
              <Column
                title="To Do"
                columnId={ColumnType.TODO}
                cards={getCardsForColumn(ColumnType.TODO)}
                boardId={currentBoard._id}
              />
              <Column
                title="In Progress"
                columnId={ColumnType.IN_PROGRESS}
                cards={getCardsForColumn(ColumnType.IN_PROGRESS)}
                boardId={currentBoard._id}
              />
              <Column
                title="Done"
                columnId={ColumnType.DONE}
                cards={getCardsForColumn(ColumnType.DONE)}
                boardId={currentBoard._id}
              />
            </BoardContainer>

            {/* Show card above everything */}
            <StyledDragOverlay>
              {activeCard ? <CardComponent card={activeCard} /> : null}
            </StyledDragOverlay>
          </DndContext>
        </>
      )}
    </PageContainer>
  )
}

export default BoardPage
