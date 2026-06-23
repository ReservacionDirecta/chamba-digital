import mongoose, { Schema, type Document } from 'mongoose'

export interface IUser extends Document {
  email: string
  password: string // Plaintext for simplicity or hashed if needed (keeping it simple and functional for local dev, we can use plaintext or simple hash)
  role: 'client' | 'admin'
  createdAt: Date
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['client', 'admin'], default: 'client' },
  createdAt: { type: Date, default: Date.now }
})

export const User = mongoose.model<IUser>('User', userSchema)
