import mongoose, { Schema, type Document } from 'mongoose'

export interface IBooking extends Document {
  serviceId: mongoose.Types.ObjectId
  clientName: string
  clientEmail: string
  clientPhone: string
  date: string
  time: string
  status: 'pending' | 'confirmed' | 'cancelled'
  paymentStatus: 'pending' | 'paid' | 'refunded'
  paymentMethod: 'polar' | 'whatsapp' | 'email' | 'bank_transfer'
  polarCheckoutId: string
  polarPaymentId: string
  notes: string
  createdAt: Date
  paidAt?: Date
}

const bookingSchema = new Schema<IBooking>({
  serviceId: { type: Schema.Types.ObjectId, ref: 'Service', required: true },
  clientName: { type: String, required: true },
  clientEmail: { type: String, required: true },
  clientPhone: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'refunded'], default: 'pending' },
  paymentMethod: { type: String, enum: ['polar', 'whatsapp', 'email', 'bank_transfer'], default: 'polar' },
  polarCheckoutId: { type: String, default: '' },
  polarPaymentId: { type: String, default: '' },
  notes: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  paidAt: { type: Date },
})

export const Booking = mongoose.model<IBooking>('Booking', bookingSchema)
