import mongoose, { Schema, type Document } from 'mongoose'

export interface ISubscription extends Document {
  name: string
  email: string
  businessName: string
  phone: string
  plan: 'base' | 'dedicado'
  status: 'active' | 'cancelled' | 'past_due' | 'trialing'
  polarCustomerId: string
  polarSubscriptionId: string
  polarCheckoutId: string
  monthlyRevenue: number
  commissionRate: number
  createdAt: Date
}

const subscriptionSchema = new Schema<ISubscription>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  businessName: { type: String, required: true },
  phone: { type: String, default: '' },
  plan: { type: String, enum: ['base', 'dedicado'], required: true },
  status: { type: String, enum: ['active', 'cancelled', 'past_due', 'trialing'], default: 'active' },
  polarCustomerId: { type: String, default: '' },
  polarSubscriptionId: { type: String, default: '' },
  polarCheckoutId: { type: String, default: '' },
  monthlyRevenue: { type: Number, default: 0 },
  commissionRate: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
})

export const Subscription = mongoose.model<ISubscription>('Subscription', subscriptionSchema)
