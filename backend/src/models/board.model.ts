import mongoose, { Document, Schema } from 'mongoose'
import { nanoid } from 'nanoid'

export interface IBoard extends Document {
  _id: string
  name: string
  createdAt: Date
}

const boardSchema = new Schema<IBoard>(
  {
    _id: {
      type: String,
      default: () => nanoid(10),
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
    _id: false, // Don't auto-generate ObjectId, use custom string ID
  }
)

export const Board = mongoose.model<IBoard>('Board', boardSchema)
