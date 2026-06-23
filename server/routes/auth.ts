import { Router } from 'express'
import { User } from '../models/User.js'

export const authRouter = Router()

// Helper to seed super admin if not exists
async function seedSuperAdmin() {
  try {
    const admin = await User.findOne({ email: 'admin@chamba.digital' })
    if (!admin) {
      await User.create({
        email: 'admin@chamba.digital',
        password: 'admin123',
        role: 'admin'
      })
      console.log('Super admin user created successfully')
    }
  } catch (err) {
    console.error('Failed to seed super admin:', err)
  }
}

// Invoke seed function
seedSuperAdmin()

// Register endpoint
authRouter.post('/register', async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña requeridos' })
  }

  try {
    const emailLower = email.toLowerCase().trim()
    const existing = await User.findOne({ email: emailLower })
    if (existing) {
      return res.status(409).json({ error: 'Este usuario ya está registrado' })
    }

    const user = await User.create({
      email: emailLower,
      password,
      role: 'client'
    })

    res.status(201).json({
      message: 'Usuario registrado con éxito',
      email: user.email,
      role: user.role
    })
  } catch (err) {
    console.error('Error during registration:', err)
    res.status(500).json({ error: 'Error interno del servidor al registrar usuario' })
  }
})

// Login endpoint
authRouter.post('/login', async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña requeridos' })
  }

  try {
    const emailLower = email.toLowerCase().trim()
    const user = await User.findOne({ email: emailLower })
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Correo o contraseña incorrectos' })
    }

    res.json({
      message: 'Inicio de sesión exitoso',
      email: user.email,
      role: user.role
    })
  } catch (err) {
    console.error('Error during login:', err)
    res.status(500).json({ error: 'Error interno del servidor al iniciar sesión' })
  }
})
