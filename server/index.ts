import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { connectDB } from './db.js'
import { serviceRouter } from './routes/services.js'
import { bookingRouter } from './routes/bookings.js'
import { checkoutRouter } from './routes/checkout.js'
import { webhookRouter } from './routes/webhook.js'
import { authRouter } from './routes/auth.js'
import { projectsRouter } from './routes/projects.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())

app.use('/api/webhook/polar', express.raw({ type: 'application/json' }))

app.use(express.json())

app.use('/api/services', serviceRouter)
app.use('/api/bookings', bookingRouter)
app.use('/api/checkout', checkoutRouter)
app.use('/api/webhook', webhookRouter)
app.use('/api/auth', authRouter)
app.use('/api/projects', projectsRouter)

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
  })
})
