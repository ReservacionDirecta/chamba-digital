import mongoose, { Schema, type Document } from 'mongoose'

export interface IService extends Document {
  name: string
  description: string
  duration: number
  price: number
  polarProductId: string
  active: boolean
  createdAt: Date
}

const serviceSchema = new Schema<IService>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  price: { type: Number, required: true },
  polarProductId: { type: String, default: '' },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
})

export const Service = mongoose.model<IService>('Service', serviceSchema)
