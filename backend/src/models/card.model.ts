import mongoose, { Document, Schema } from 'mongoose'

export enum ColumnType {
  TODO = 'todo',
  IN_PROGRESS = 'inProgress',
  DONE = 'done',
}

export interface ICard extends Document {
  title: string
  description?: string
  boardId: string
  column: ColumnType
  order: number
  createdAt: Date
  updatedAt: Date
}

const cardSchema = new Schema<ICard>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    boardId: {
      type: String,
      ref: 'Board',
      required: true,
      index: true,
    },
    column: {
      type: String,
      enum: Object.values(ColumnType),
      default: ColumnType.TODO,
      required: true,
    },
    order: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
)

// Create compound index for efficient querying by boardId and column
cardSchema.index({ boardId: 1, column: 1, order: 1 })

export const Card = mongoose.model<ICard>('Card', cardSchema)
