import { Router } from 'express'
import crypto from 'crypto'
import { Booking } from '../models/Booking.js'
import { Subscription } from '../models/Subscription.js'
import { sendPaymentConfirmed, sendSubscriptionWelcome } from '../services/email.js'

export const webhookRouter = Router()

function verifyPolarSignature(payload: string, signature: string, secret: string): boolean {
  const hmac = crypto.createHmac('sha256', secret)
  hmac.update(payload)
  const expected = hmac.digest('hex')
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
}

webhookRouter.post('/polar', async (req, res) => {
  const signature = req.headers['polar-signature'] as string
  const secret = process.env.POLAR_WEBHOOK_SECRET

  if (secret && signature) {
    const rawBody = (req as any).rawBody || JSON.stringify(req.body)
    if (!verifyPolarSignature(rawBody, signature, secret)) {
      return res.status(401).json({ error: 'Invalid signature' })
    }
  }

  const event = req.body

  switch (event.type) {
    case 'checkout.updated': {
      const checkout = event.data
      if (checkout.status === 'confirmed' && checkout.metadata?.bookingId) {
        const booking = await Booking.findById(checkout.metadata.bookingId).populate('serviceId')
        if (booking) {
          booking.status = 'confirmed'
          booking.paymentStatus = 'paid'
          booking.paymentMethod = 'polar'
          booking.polarCheckoutId = checkout.id
          booking.polarPaymentId = checkout.payment_id || ''
          booking.paidAt = new Date()
          await booking.save()

          const service = booking.serviceId as any
          try {
            await sendPaymentConfirmed({
              to: booking.clientEmail,
              clientName: booking.clientName,
              serviceName: service.name,
              date: booking.date,
              time: booking.time,
              amount: service.price,
              bookingId: booking._id.toString(),
            })
          } catch (err) {
            console.error('Email send failed:', err)
          }
        }
      }

      if (checkout.status === 'confirmed' && checkout.metadata?.subscriptionId) {
        const sub = await Subscription.findById(checkout.metadata.subscriptionId)
        if (sub) {
          sub.status = 'active'
          sub.polarCheckoutId = checkout.id
          sub.polarCustomerId = checkout.customer_id || ''
          await sub.save()

          try {
            await sendSubscriptionWelcome({
              to: sub.email,
              name: sub.name,
              businessName: sub.businessName,
              plan: sub.plan === 'base' ? 'Plan Base ($30/mes)' : 'Plan Dedicado ($99/mes + 6%)',
            })
          } catch (err) {
            console.error('Email send failed:', err)
          }
        }
      }
      break
    }

    case 'subscription.updated': {
      const subData = event.data
      const sub = await Subscription.findOne({ polarSubscriptionId: subData.id })
      if (sub) {
        sub.status = subData.status === 'active' ? 'active'
          : subData.status === 'canceled' ? 'cancelled'
          : subData.status === 'past_due' ? 'past_due'
          : sub.status
        await sub.save()
      }
      break
    }

    default:
      break
  }

  res.json({ received: true })
})

webhookRouter.post('/whatsapp-confirm', async (req, res) => {
  const { bookingId } = req.body
  const booking = await Booking.findById(bookingId).populate('serviceId')
  if (!booking) return res.status(404).json({ error: 'Booking not found' })

  booking.status = 'confirmed'
  booking.paymentStatus = 'paid'
  booking.paymentMethod = 'whatsapp'
  booking.paidAt = new Date()
  await booking.save()

  const service = booking.serviceId as any
  try {
    await sendPaymentConfirmed({
      to: booking.clientEmail,
      clientName: booking.clientName,
      serviceName: service.name,
      date: booking.date,
      time: booking.time,
      amount: service.price,
      bookingId: booking._id.toString(),
    })
  } catch (err) {
    console.error('Email send failed:', err)
  }

  res.json(booking)
})

webhookRouter.post('/email-confirm', async (req, res) => {
  const { bookingId } = req.body
  const booking = await Booking.findById(bookingId).populate('serviceId')
  if (!booking) return res.status(404).json({ error: 'Booking not found' })

  booking.status = 'confirmed'
  booking.paymentStatus = 'paid'
  booking.paymentMethod = 'email'
  booking.paidAt = new Date()
  await booking.save()

  const service = booking.serviceId as any
  try {
    await sendPaymentConfirmed({
      to: booking.clientEmail,
      clientName: booking.clientName,
      serviceName: service.name,
      date: booking.date,
      time: booking.time,
      amount: service.price,
      bookingId: booking._id.toString(),
    })
  } catch (err) {
    console.error('Email send failed:', err)
  }

  res.json(booking)
})
