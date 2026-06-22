import { Router } from 'express'
import { Service } from '../models/Service.js'

export const serviceRouter = Router()

serviceRouter.get('/', async (_req, res) => {
  const services = await Service.find({ active: true }).sort({ createdAt: 1 })
  res.json(services)
})

serviceRouter.get('/:id', async (req, res) => {
  const service = await Service.findById(req.params.id)
  if (!service) return res.status(404).json({ error: 'Service not found' })
  res.json(service)
})

serviceRouter.post('/', async (req, res) => {
  const service = await Service.create(req.body)
  res.status(201).json(service)
})

serviceRouter.put('/:id', async (req, res) => {
  const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true })
  if (!service) return res.status(404).json({ error: 'Service not found' })
  res.json(service)
})

serviceRouter.delete('/:id', async (req, res) => {
  await Service.findByIdAndDelete(req.params.id)
  res.json({ ok: true })
})
