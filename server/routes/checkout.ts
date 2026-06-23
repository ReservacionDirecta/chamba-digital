import { Router } from 'express'
import { Booking } from '../models/Booking.js'
import { Service } from '../models/Service.js'

export const checkoutRouter = Router()

const POLAR_API = 'https://api.polar.sh/v1'

checkoutRouter.post('/session', async (req, res) => {
  const { serviceId, clientName, clientEmail, clientPhone, date, time } = req.body

  const token = process.env.POLAR_ACCESS_TOKEN
  if (!token) {
    return res.status(500).json({ error: 'Polar access token not configured' })
  }

  try {
    const service = await Service.findById(serviceId)
    if (!service) return res.status(404).json({ error: 'Service not found' })

    const booking = await Booking.create({
      serviceId,
      clientName,
      clientEmail,
      clientPhone,
      date,
      time,
      status: 'pending',
      paymentStatus: 'pending',
      paymentMethod: 'polar',
    })

    const origin = req.headers.origin || 'http://localhost:5173'

    // If using default / dummy token, bypass Polar API call and enter demo mode
    if (token === 'your_polar_access_token' || token.startsWith('your_')) {
      return res.json({
        isDemo: true,
        bookingId: booking._id,
      })
    }

    const response = await fetch(`${POLAR_API}/checkouts`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        product_id: serviceId,
        success_url: `${origin}/#/pago-exitoso?bookingId=${booking._id}`,
        customer_email: clientEmail,
        metadata: {
          bookingId: booking._id.toString(),
          clientName,
          clientEmail,
          clientPhone,
          date,
          time,
          serviceName: service.name,
          amount: service.price.toString(),
        },
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      console.error('Polar API error:', err)
      return res.status(500).json({ error: 'Failed to create checkout' })
    }

    const checkout = await response.json()
    booking.polarCheckoutId = checkout.id
    await booking.save()

    res.json({
      checkoutUrl: checkout.url,
      bookingId: booking._id,
      checkoutId: checkout.id,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

checkoutRouter.post('/subscription', async (req, res) => {
  const { name, email, businessName, phone, plan } = req.body

  const token = process.env.POLAR_ACCESS_TOKEN
  if (!token) {
    return res.status(500).json({ error: 'Polar access token not configured' })
  }

  try {
    const { Subscription } = await import('../models/Subscription.js')

    const existing = await Subscription.findOne({ email })
    if (existing) {
      return res.status(409).json({ error: 'Este email ya tiene una suscripción activa' })
    }

    const subscription = await Subscription.create({
      name,
      email,
      businessName,
      phone,
      plan,
      status: 'active',
      commissionRate: plan === 'dedicado' ? 6 : 0,
    })

    // If using default / dummy token, bypass Polar API call and enter demo mode
    if (token === 'your_polar_access_token' || token.startsWith('your_') || !process.env.POLAR_PRODUCT_BASE) {
      return res.json({
        isDemo: true,
        subscriptionId: subscription._id,
      })
    }

    const origin = req.headers.origin || 'http://localhost:5173'

    const response = await fetch(`${POLAR_API}/checkouts`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        product_id: plan === 'base'
          ? process.env.POLAR_PRODUCT_BASE
          : process.env.POLAR_PRODUCT_DEDICADO,
        success_url: `${origin}/#/suscripcion-exitosa?subscriptionId=${subscription._id}`,
        customer_email: email,
        metadata: {
          subscriptionId: subscription._id.toString(),
          name,
          email,
          businessName,
          phone,
          plan,
        },
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      console.error('Polar API error:', err)
      return res.status(500).json({ error: 'Failed to create checkout' })
    }

    const checkout = await response.json()
    subscription.polarCheckoutId = checkout.id
    await subscription.save()

    res.json({
      checkoutUrl: checkout.url,
      subscriptionId: subscription._id,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
})
