import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { type Card as CardType } from '../../types'
import Card from './Card'

interface SortableCardProps {
  card: CardType
}

const SortableCard = ({ card }: SortableCardProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({
      id: card._id,
      data: {
        type: 'card',
        card,
      },
    })

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.2 : 1,
    zIndex: isDragging ? 1 : 0,
    boxShadow: isDragging
      ? '0 5px 15px rgba(0, 0, 0, 0.25), 0 3px 3px rgba(0, 0, 0, 0.22)'
      : 'none',
    cursor: isDragging ? 'grabbing' : 'grab',
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card card={card} />
    </div>
  )
}

export default SortableCard
