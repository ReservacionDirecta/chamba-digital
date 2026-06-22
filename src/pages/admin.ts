import { fetchServices, getBookings, createService, deleteService } from '../lib/api.js'

export async function renderAdmin(container: HTMLDivElement) {
  container.innerHTML = `<div class="loader">Cargando panel...</div>`

  let services: any[] = []
  let bookings: any[] = []
  try {
    ;[services, bookings] = await Promise.all([fetchServices(), getBookings()])
  } catch {
    services = []
    bookings = []
  }

  container.innerHTML = `
    <nav class="navbar">
      <div class="container nav-inner">
        <a href="#/" class="logo">chamba<span>.digital</span></a>
        <a href="#/" class="btn btn-outline btn-sm">&larr; Volver</a>
      </div>
    </nav>

    <section class="admin-page">
      <div class="container">
        <h1>Panel de administracion</h1>

        <div class="admin-grid">
          <div class="admin-section">
            <h2>Servicios</h2>
            <form id="service-form" class="admin-form">
              <div class="form-row">
                <input type="text" id="svc-name" class="input" placeholder="Nombre del servicio" required />
                <input type="number" id="svc-duration" class="input input-sm" placeholder="Min" required />
                <input type="number" id="svc-price" class="input input-sm" placeholder="Precio" required />
              </div>
              <div class="form-row">
                <input type="text" id="svc-desc" class="input" placeholder="Descripcion" required />
                <input type="text" id="svc-polar" class="input" placeholder="Polar Product ID (opcional)" />
                <button type="submit" class="btn btn-primary">Agregar</button>
              </div>
            </form>

            <div class="admin-table-wrap">
              <table class="admin-table">
                <thead>
                  <tr>
                    <th>Servicio</th>
                    <th>Duracion</th>
                    <th>Precio</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  ${services.map((s: any) => `
                    <tr>
                      <td>${s.name}</td>
                      <td>${s.duration} min</td>
                      <td>$${s.price}</td>
                      <td>
                        <button class="btn btn-danger btn-sm" data-delete="${s._id}">Eliminar</button>
                      </td>
                    </tr>
                  `).join('')}
                  ${services.length === 0 ? '<tr><td colspan="4" class="empty-cell">No hay servicios</td></tr>' : ''}
                </tbody>
              </table>
            </div>
          </div>

          <div class="admin-section">
            <h2>Reservas recientes</h2>
            <div class="admin-table-wrap">
              <table class="admin-table">
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>Fecha</th>
                    <th>Hora</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  ${bookings.map((b: any) => `
                    <tr>
                      <td>${b.clientName}</td>
                      <td>${b.date}</td>
                      <td>${b.time}</td>
                      <td><span class="status-${b.status}">${b.status}</span></td>
                    </tr>
                  `).join('')}
                  ${bookings.length === 0 ? '<tr><td colspan="4" class="empty-cell">No hay reservas aun</td></tr>' : ''}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  `

  const form = container.querySelector('#service-form')!
  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    const name = (container.querySelector('#svc-name') as HTMLInputElement).value
    const description = (container.querySelector('#svc-desc') as HTMLInputElement).value
    const duration = Number((container.querySelector('#svc-duration') as HTMLInputElement).value)
    const price = Number((container.querySelector('#svc-price') as HTMLInputElement).value)
    const polarProductId = (container.querySelector('#svc-polar') as HTMLInputElement).value

    await createService({ name, description, duration, price, polarProductId })
    renderAdmin(container)
  })

  container.querySelectorAll('[data-delete]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.getAttribute('data-delete')!
      if (confirm('Eliminar este servicio?')) {
        await deleteService(id)
        renderAdmin(container)
      }
    })
  })
}
