const API = import.meta.env.VITE_API_URL || '/api'

export async function fetchServices() {
  const res = await fetch(`${API}/services`)
  return res.json()
}

export async function createBooking(data: {
  serviceId: string
  clientName: string
  clientEmail: string
  clientPhone: string
  date: string
  time: string
}) {
  const res = await fetch(`${API}/checkout/session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return res.json()
}

export async function getBooking(id: string) {
  const res = await fetch(`${API}/bookings/${id}`)
  return res.json()
}

export async function getBookings() {
  const res = await fetch(`${API}/bookings`)
  return res.json()
}

export async function createService(data: {
  name: string
  description: string
  duration: number
  price: number
  polarProductId: string
}) {
  const res = await fetch(`${API}/services`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return res.json()
}

export async function deleteService(id: string) {
  await fetch(`${API}/services/${id}`, { method: 'DELETE' })
}
