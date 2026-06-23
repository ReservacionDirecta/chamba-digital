import { Router } from 'express'
import { Project } from '../models/Project.js'
import { Subscription } from '../models/Subscription.js'

export const projectsRouter = Router()

// Get project of the currently logged in client (uses email from header)
projectsRouter.get('/my', async (req, res) => {
  const email = req.headers['x-user-email'] as string
  if (!email) return res.status(400).json({ error: 'Falta la cabecera x-user-email' })

  try {
    const emailLower = email.toLowerCase().trim()
    let project = await Project.findOne({ userId: emailLower })
    if (!project) {
      // Look for active subscription to prefill
      const sub = await Subscription.findOne({ email: emailLower })
      const defaultProj = {
        userId: emailLower,
        businessName: sub ? sub.businessName : '',
        niche: 'Peluquerías',
        webType: 'Moderna',
        services: 'Corte de cabello (30 min - $15)\nManicura (45 min - $25)',
        whatsapp: sub ? sub.phone : '',
        notes: '',
        plan: sub ? sub.plan : 'base',
        status: 'Recibido',
        chatHistory: [
          {
            sender: 'admin',
            message: '¡Hola! Bienvenido a chamba.digital. Ya recibimos tu solicitud. Completa los datos de este formulario para comenzar a diseñar tu web.',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            createdAt: new Date()
          }
        ]
      }
      return res.json(defaultProj)
    }
    res.json(project)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error al buscar el proyecto en MongoDB' })
  }
})

// Save/update project of the currently logged in client
projectsRouter.post('/my', async (req, res) => {
  const email = req.headers['x-user-email'] as string
  if (!email) return res.status(400).json({ error: 'Falta la cabecera x-user-email' })

  const { businessName, niche, webType, services, whatsapp, notes } = req.body

  try {
    const emailLower = email.toLowerCase().trim()
    const sub = await Subscription.findOne({ email: emailLower })
    const plan = sub ? sub.plan : 'base'

    let project = await Project.findOne({ userId: emailLower })
    if (project) {
      project.businessName = businessName
      project.niche = niche
      project.webType = webType
      project.services = services
      project.whatsapp = whatsapp
      project.notes = notes
      await project.save()
    } else {
      project = await Project.create({
        userId: emailLower,
        businessName,
        niche,
        webType,
        services,
        whatsapp,
        notes,
        plan,
        status: 'Recibido',
        chatHistory: [
          {
            sender: 'admin',
            message: '¡Hola! Bienvenido a chamba.digital. Ya recibimos tu solicitud. Completa los datos de este formulario para comenzar a diseñar tu web.',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            createdAt: new Date()
          }
        ]
      })
    }
    res.json(project)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error al guardar el proyecto en MongoDB' })
  }
})

// Get all projects (Admin dashboard Kanban)
projectsRouter.get('/', async (req, res) => {
  try {
    const projects = await Project.find().sort({ updatedAt: -1 })
    res.json(projects)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error al obtener proyectos para el dashboard' })
  }
})

// Update status of any project (Kanban move)
projectsRouter.put('/:id/status', async (req, res) => {
  const { status } = req.body
  try {
    const project = await Project.findById(req.params.id)
    if (!project) return res.status(404).json({ error: 'Proyecto no encontrado' })

    project.status = status
    await project.save()
    res.json(project)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error al actualizar el estado del proyecto' })
  }
})

// Post chat message in CRM for a project
projectsRouter.post('/:id/chat', async (req, res) => {
  const { sender, message } = req.body
  if (!sender || !message) return res.status(400).json({ error: 'Faltan campos obligatorios en el chat' })

  try {
    const project = await Project.findById(req.params.id)
    if (!project) return res.status(404).json({ error: 'Proyecto no encontrado' })

    const newMsg = {
      sender,
      message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      createdAt: new Date()
    }

    project.chatHistory.push(newMsg)
    await project.save()
    res.json(project)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error al registrar el mensaje de chat en MongoDB' })
  }
})
