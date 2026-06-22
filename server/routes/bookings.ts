import { Router } from 'express'
import { Booking } from '../models/Booking.js'
import { Service } from '../models/Service.js'
import { sendBookingConfirmation, sendPaymentConfirmed } from '../services/email.js'

export const bookingRouter = Router()

bookingRouter.get('/', async (_req, res) => {
  const bookings = await Booking.find().populate('serviceId').sort({ createdAt: -1 })
  res.json(bookings)
})

bookingRouter.get('/:id', async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate('serviceId')
  if (!booking) return res.status(404).json({ error: 'Booking not found' })
  res.json(booking)
})

bookingRouter.post('/', async (req, res) => {
  const { serviceId, clientName, clientEmail, clientPhone, date, time } = req.body

  const existing = await Booking.findOne({
    serviceId,
    date,
    time,
    status: { $ne: 'cancelled' },
  })
  if (existing) {
    return res.status(409).json({ error: 'Este horario ya está reservado' })
  }

  const service = await Service.findById(serviceId)
  if (!service) return res.status(404).json({ error: 'Servicio no encontrado' })

  const booking = await Booking.create({
    serviceId,
    clientName,
    clientEmail,
    clientPhone,
    date,
    time,
    status: 'pending',
    paymentStatus: 'pending',
  })

  try {
    await sendBookingConfirmation({
      to: clientEmail,
      clientName,
      serviceName: service.name,
      date,
      time,
      amount: service.price,
      bookingId: booking._id.toString(),
    })
  } catch (err) {
    console.error('Email send failed:', err)
  }

  res.status(201).json(booking)
})

bookingRouter.patch('/:id/status', async (req, res) => {
  const booking = await Booking.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  )
  if (!booking) return res.status(404).json({ error: 'Booking not found' })
  res.json(booking)
})

bookingRouter.patch('/:id/confirm-payment', async (req, res) => {
  const { method } = req.body
  const booking = await Booking.findById(req.params.id).populate('serviceId')
  if (!booking) return res.status(404).json({ error: 'Booking not found' })

  booking.status = 'confirmed'
  booking.paymentStatus = 'paid'
  booking.paymentMethod = method || 'polar'
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
