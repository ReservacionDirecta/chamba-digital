import mongoose from 'mongoose'
import { User } from './models/User.js'
import { Project } from './models/Project.js'
import { Subscription } from './models/Subscription.js'
import dotenv from 'dotenv'

dotenv.config()

const MONGODB_URI = process.argv[2] || process.env.MONGODB_URI || 'mongodb://localhost:27017/polar-booking'

const defaultUsers = [
  { email: 'admin@chamba.digital', password: 'admin123', role: 'admin' },
  { email: 'salon-glamour@email.com', password: 'client123', role: 'client' },
  { email: 'dental-care@email.com', password: 'client123', role: 'client' },
  { email: 'barber-shop@email.com', password: 'client123', role: 'client' }
]

const defaultSubscriptions = [
  {
    name: 'Cliente Glamour',
    email: 'salon-glamour@email.com',
    businessName: 'Salón Glamour',
    phone: '+52 555 123 4567',
    plan: 'base',
    status: 'active',
    monthlyRevenue: 30
  },
  {
    name: 'Doctor Diente',
    email: 'dental-care@email.com',
    businessName: 'Dental Care',
    phone: '+52 555 987 6543',
    plan: 'dedicado',
    status: 'active',
    monthlyRevenue: 99,
    commissionRate: 6
  },
  {
    name: 'Barbero Bros',
    email: 'barber-shop@email.com',
    businessName: 'Barberia Bros',
    phone: '+52 555 111 2222',
    plan: 'base',
    status: 'active',
    monthlyRevenue: 30
  }
]

const defaultProjects = [
  {
    userId: 'salon-glamour@email.com',
    businessName: 'Salón Glamour',
    niche: 'Spas & Estética',
    webType: 'Moderna',
    services: 'Masaje relajante (60 min - $50)\nCorte de dama (40 min - $25)',
    whatsapp: '+52 555 123 4567',
    notes: 'Queremos tonos dorados y negros con look de lujo.',
    plan: 'base',
    status: 'Recibido',
    chatHistory: [
      { sender: 'client', message: 'Hola, me gustaría saber si podemos integrar pagos con Stripe.', time: '10:00 AM', createdAt: new Date() },
      { sender: 'admin', message: '¡Hola! Sí, lo podemos integrar en el Plan Dedicado sin problema.', time: '10:05 AM', createdAt: new Date() }
    ]
  },
  {
    userId: 'dental-care@email.com',
    businessName: 'Dental Care',
    niche: 'Consultorios',
    webType: 'Minimalista',
    services: 'Limpieza dental (45 min - $40)\nConsulta general (30 min - $20)',
    whatsapp: '+52 555 987 6543',
    notes: 'Un estilo muy limpio e higiénico, preferiblemente blanco y azul claro.',
    plan: 'dedicado',
    status: 'En Diseño',
    chatHistory: [
      { sender: 'admin', message: 'Hola, hemos comenzado con el diseño de tu web Dental Care.', time: '09:00 AM', createdAt: new Date() }
    ]
  },
  {
    userId: 'barber-shop@email.com',
    businessName: 'Barberia Bros',
    niche: 'Peluquerías',
    webType: 'Moderna',
    services: 'Corte y barba (50 min - $22)',
    whatsapp: '+52 555 111 2222',
    notes: 'Estilo rústico, madera y tonos oscuros.',
    plan: 'base',
    status: 'En Desarrollo',
    chatHistory: [
      { sender: 'client', message: '¡Se ve excelente la demo! ¿Cuándo hacemos la integración del botón?', time: '06:30 PM', createdAt: new Date() }
    ]
  }
]

async function seed() {
  console.log(`Connecting to MongoDB at: ${MONGODB_URI}`)
  await mongoose.connect(MONGODB_URI)
  console.log('Connected to MongoDB')

  // Clean models
  console.log('Cleaning collections...')
  await User.deleteMany({})
  await Subscription.deleteMany({})
  await Project.deleteMany({})

  // Insert Users
  console.log('Seeding Users...')
  await User.insertMany(defaultUsers)
  console.log(`Successfully seeded ${defaultUsers.length} users.`)

  // Insert Subscriptions
  console.log('Seeding Subscriptions...')
  await Subscription.insertMany(defaultSubscriptions)
  console.log(`Successfully seeded ${defaultSubscriptions.length} subscriptions.`)

  // Insert Projects
  console.log('Seeding Projects...')
  await Project.insertMany(defaultProjects)
  console.log(`Successfully seeded ${defaultProjects.length} projects.`)

  await mongoose.disconnect()
  console.log('Successfully completed seeding. Disconnected.')
}

seed().catch(err => {
  console.error('Error during seeding:', err)
  process.exit(1)
})
