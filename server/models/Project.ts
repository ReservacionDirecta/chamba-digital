import mongoose, { Schema, type Document } from 'mongoose'

export interface IChatMessage {
  sender: 'admin' | 'client'
  message: string
  time: string
  createdAt: Date
}

export interface IProject extends Document {
  userId: string // user email
  businessName: string
  niche: string
  webType: string
  services: string
  whatsapp: string
  notes: string
  plan: 'base' | 'dedicado'
  status: 'Recibido' | 'En Diseño' | 'En Desarrollo' | 'Completado'
  chatHistory: IChatMessage[]
  createdAt: Date
  updatedAt: Date
}

const chatMessageSchema = new Schema<IChatMessage>({
  sender: { type: String, enum: ['admin', 'client'], required: true },
  message: { type: String, required: true },
  time: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
})

const projectSchema = new Schema<IProject>({
  userId: { type: String, required: true, unique: true },
  businessName: { type: String, required: true },
  niche: { type: String, default: 'Otros' },
  webType: { type: String, default: 'Moderna' },
  services: { type: String, default: '' },
  whatsapp: { type: String, default: '' },
  notes: { type: String, default: '' },
  plan: { type: String, enum: ['base', 'dedicado'], default: 'base' },
  status: { type: String, enum: ['Recibido', 'En Diseño', 'En Desarrollo', 'Completado'], default: 'Recibido' },
  chatHistory: [chatMessageSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

// Update the updatedAt timestamp on save
projectSchema.pre('save', function () {
  this.updatedAt = new Date()
})

export const Project = mongoose.model<IProject>('Project', projectSchema)
