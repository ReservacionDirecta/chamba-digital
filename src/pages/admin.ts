import { fetchServices, getBookings, createService, deleteService } from '../lib/api.js'

const defaultProjects = [
  {
    id: 'salon-glamour@email.com',
    businessName: 'Salón Glamour',
    niche: 'Spas & Estética',
    webType: 'Moderna',
    services: 'Masaje relajante (60 min - $50)\nCorte de dama (40 min - $25)',
    whatsapp: '+52 555 123 4567',
    notes: 'Queremos tonos dorados y negros con look de lujo.',
    plan: 'base',
    status: 'Recibido',
    createdAt: '22/06/2026',
    chatHistory: [
      { sender: 'client', message: 'Hola, me gustaría saber si podemos integrar pagos con Stripe.', time: '10:00 AM' },
      { sender: 'admin', message: '¡Hola! Sí, lo podemos integrar en el Plan Dedicado sin problema.', time: '10:05 AM' }
    ]
  },
  {
    id: 'dental-care@email.com',
    businessName: 'Dental Care',
    niche: 'Consultorios',
    webType: 'Minimalista',
    services: 'Limpieza dental (45 min - $40)\nConsulta general (30 min - $20)',
    whatsapp: '+52 555 987 6543',
    notes: 'Un estilo muy limpio e higiénico, preferiblemente blanco y azul claro.',
    plan: 'dedicado',
    status: 'En Diseño',
    createdAt: '21/06/2026',
    chatHistory: [
      { sender: 'admin', message: 'Hola, hemos comenzado con el diseño de tu web Dental Care.', time: '09:00 AM' }
    ]
  },
  {
    id: 'barber-shop@email.com',
    businessName: 'Barberia Bros',
    niche: 'Peluquerías',
    webType: 'Moderna',
    services: 'Corte y barba (50 min - $22)',
    whatsapp: '+52 555 111 2222',
    notes: 'Estilo rústico, madera y tonos oscuros.',
    plan: 'base',
    status: 'En Desarrollo',
    createdAt: '20/06/2026',
    chatHistory: [
      { sender: 'client', message: '¡Se ve excelente la demo! ¿Cuándo hacemos la integración del botón?', time: '06:30 PM' }
    ]
  }
]

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

  // Load projects
  const projectListKeys: string[] = JSON.parse(localStorage.getItem('active_projects_list') || '[]')
  let projects: any[] = []

  if (projectListKeys.length === 0) {
    const defaultKeys: string[] = []
    defaultProjects.forEach(p => {
      localStorage.setItem(`project_${p.id}`, JSON.stringify(p))
      defaultKeys.push(p.id)
    })
    localStorage.setItem('active_projects_list', JSON.stringify(defaultKeys))
    projects = [...defaultProjects]
  } else {
    projectListKeys.forEach(k => {
      const raw = localStorage.getItem(`project_${k}`)
      if (raw) projects.push(JSON.parse(raw))
    })
  }

  // State
  let currentTab = localStorage.getItem('admin_current_tab') || 'projects'
  let filterNiche = 'all'
  let filterPlan = 'all'
  let activeDetailProject: any | null = null

  function updateView() {
    container.innerHTML = `
      <nav class="navbar scrolled" style="box-shadow: 0 1px 0 rgba(0,0,0,0.05);">
        <div class="container nav-inner">
          <a href="#/" class="logo" style="color:var(--color-ink)">chamba<span>.digital</span></a>
          <div style="display:flex; gap:8px;">
            <button class="btn ${currentTab === 'projects' ? 'btn-primary' : 'btn-ghost'} btn-sm tab-btn" data-tab="projects" style="border-radius:6px;">Proyectos & CRM</button>
            <button class="btn ${currentTab === 'services' ? 'btn-primary' : 'btn-ghost'} btn-sm tab-btn" data-tab="services" style="border-radius:6px;">Servicios & Reservas</button>
            <a href="#/" class="btn btn-outline btn-sm" style="border-radius:6px; padding: 8px 14px;">Volver</a>
          </div>
        </div>
      </nav>

      <section class="admin-page" style="margin-top: 96px; padding-bottom: 64px;">
        <div class="container">
          ${currentTab === 'projects' ? renderProjectsTab() : renderServicesTab()}
        </div>
      </section>

      ${activeDetailProject ? renderDetailModal() : ''}
    `

    setupEventListeners()
  }

  function renderProjectsTab() {
    const filtered = projects.filter(p => {
      if (filterNiche !== 'all' && p.niche !== filterNiche) return false
      if (filterPlan !== 'all' && p.plan !== filterPlan) return false
      return true
    })

    const columns = [
      { key: 'Recibido', title: 'Recibido', icon: '📥', color: '#3b82f6' },
      { key: 'En Diseño', title: 'En Diseño', icon: '🎨', color: '#a855f7' },
      { key: 'En Desarrollo', title: 'En Desarrollo', icon: '💻', color: '#f59e0b' },
      { key: 'Completado', title: 'Completado', icon: '✅', color: '#10b981' }
    ]

    return `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 32px; flex-wrap:wrap; gap:16px; border-bottom: 1px solid var(--color-border); padding-bottom: 20px;">
        <div>
          <h1 style="font-size: 28px; font-weight: 800; letter-spacing:-0.03em; margin: 0 0 4px;">Gestión de Cuentas</h1>
          <p style="color:var(--color-ink-secondary); font-size:14px; margin:0;">Tablero de control y CRM integrado para proyectos activos.</p>
        </div>
        
        <div style="display:flex; gap:16px; flex-wrap:wrap; align-items:center;">
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-size: 13px; font-weight: 600; color: var(--color-ink-secondary);">Nicho:</span>
            <select id="filter-niche" class="input" style="height:36px; min-width: 140px; padding:0 12px; font-size:13px; border-radius:6px;">
              <option value="all" ${filterNiche === 'all' ? 'selected' : ''}>Todos</option>
              <option value="Peluquerías" ${filterNiche === 'Peluquerías' ? 'selected' : ''}>Barberías</option>
              <option value="Consultorios" ${filterNiche === 'Consultorios' ? 'selected' : ''}>Consultorios</option>
              <option value="Spas & Estética" ${filterNiche === 'Spas & Estética' ? 'selected' : ''}>Spas</option>
              <option value="Gimnasios" ${filterNiche === 'Gimnasios' ? 'selected' : ''}>Gimnasios</option>
              <option value="Inmobiliarias & Realtors" ${filterNiche === 'Inmobiliarias & Realtors' ? 'selected' : ''}>Inmobiliarias</option>
              <option value="Talleres mecánicos" ${filterNiche === 'Talleres mecánicos' ? 'selected' : ''}>Talleres</option>
            </select>
          </div>

          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-size: 13px; font-weight: 600; color: var(--color-ink-secondary);">Plan:</span>
            <select id="filter-plan" class="input" style="height:36px; min-width: 120px; padding:0 12px; font-size:13px; border-radius:6px;">
              <option value="all" ${filterPlan === 'all' ? 'selected' : ''}>Todos</option>
              <option value="base" ${filterPlan === 'base' ? 'selected' : ''}>Plan Base</option>
              <option value="dedicado" ${filterPlan === 'dedicado' ? 'selected' : ''}>Plan Dedicado</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Kanban Grid -->
      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap:20px;">
        ${columns.map(col => {
          const colProjects = filtered.filter(p => p.status === col.key)
          return `
            <div style="background:var(--color-surface-0); border:1px solid var(--color-border); border-radius:12px; padding:16px; min-height:550px; display:flex; flex-direction:column; gap:14px;">
              <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(0,0,0,0.03); padding-bottom:10px;">
                <div style="display:flex; align-items:center; gap:8px;">
                  <span style="font-size:15px;">${col.icon}</span>
                  <span style="font-size:14px; font-weight:700; color:var(--color-ink);">${col.title}</span>
                </div>
                <span style="background:var(--color-surface-3); color:var(--color-ink-secondary); font-size:11px; padding:2px 8px; border-radius:10px; font-weight:700;">${colProjects.length}</span>
              </div>
              
              <div style="display:flex; flex-direction:column; gap:12px; flex-grow:1;">
                ${colProjects.map(proj => `
                  <div class="project-card" data-id="${proj.id}" style="background:white; border:1px solid var(--color-border-strong); border-radius:10px; padding:16px; cursor:pointer; transition:transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease; box-shadow:0 1px 3px rgba(0,0,0,0.02);">
                    <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
                      <span style="font-size:10px; font-weight:700; text-transform:uppercase; padding:3px 8px; border-radius:100px; background:${proj.plan === 'base' ? 'var(--color-accent-muted)' : 'rgba(168, 85, 247, 0.08)'}; color:${proj.plan === 'base' ? 'var(--color-accent)' : '#a855f7'};">
                        Plan ${proj.plan}
                      </span>
                      <span style="font-size:11px; color:var(--color-ink-muted);">${proj.createdAt}</span>
                    </div>
                    
                    <h4 style="font-size:14px; font-weight:700; margin:0 0 6px; color:var(--color-ink);">${proj.businessName}</h4>
                    <p style="font-size:12px; color:var(--color-ink-secondary); margin:0 0 14px; line-height:1.4;">${proj.niche} &bull; Web ${proj.webType}</p>
                    
                    <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid rgba(0,0,0,0.03); padding-top:10px;">
                      <span style="font-size:11px; color:var(--color-accent); font-weight:600; display:inline-flex; align-items:center; gap:4px;">
                        Ver ficha &rarr;
                      </span>
                      
                      <div style="display:flex; gap:6px;">
                        ${col.key !== 'Recibido' ? `
                          <button class="move-btn" data-id="${proj.id}" data-to="${columns[columns.findIndex(c => c.key === col.key) - 1].key}" style="border:1px solid var(--color-border); background:white; color:var(--color-ink-secondary); width:24px; height:24px; border-radius:6px; cursor:pointer; font-size:11px; display:flex; align-items:center; justify-content:center;">
                            &larr;
                          </button>
                        ` : ''}
                        ${col.key !== 'Completado' ? `
                          <button class="move-btn" data-id="${proj.id}" data-to="${columns[columns.findIndex(c => c.key === col.key) + 1].key}" style="border:1px solid var(--color-border); background:white; color:var(--color-ink-secondary); width:24px; height:24px; border-radius:6px; cursor:pointer; font-size:11px; display:flex; align-items:center; justify-content:center;">
                            &rarr;
                          </button>
                        ` : ''}
                      </div>
                    </div>
                  </div>
                `).join('')}
                ${colProjects.length === 0 ? `
                  <div style="font-size:12px; color:var(--color-ink-muted); text-align:center; padding:40px 0; border:1px dashed var(--color-border); border-radius:10px; background:rgba(255,255,255,0.4);">
                    Sin proyectos en esta etapa
                  </div>
                ` : ''}
              </div>
            </div>
          `
        }).join('')}
      </div>
    `
  }

  function renderServicesTab() {
    return `
      <div style="margin-bottom: 32px; border-bottom: 1px solid var(--color-border); padding-bottom: 20px;">
        <h1 style="font-size: 28px; font-weight: 800; letter-spacing:-0.03em; margin: 0 0 4px;">Configuración del Motor</h1>
        <p style="color:var(--color-ink-secondary); font-size:14px; margin:0;">Edita el menú de servicios y revisa las citas del calendario cliente.</p>
      </div>

      <div class="admin-grid">
        <div class="admin-section">
          <h2>Agregar Servicio</h2>
          <form id="service-form" class="admin-form">
            <div class="form-row">
              <input type="text" id="svc-name" class="input" placeholder="Ej. Corte Clásico" required style="border-radius:6px;" />
              <input type="number" id="svc-duration" class="input input-sm" placeholder="Min" required style="border-radius:6px; max-width:80px;" />
              <input type="number" id="svc-price" class="input input-sm" placeholder="Precio" required style="border-radius:6px; max-width:90px;" />
            </div>
            <div class="form-row">
              <input type="text" id="svc-desc" class="input" placeholder="Descripción breve" required style="border-radius:6px;" />
              <input type="text" id="svc-polar" class="input" placeholder="Polar Product ID (opcional)" style="border-radius:6px;" />
              <button type="submit" class="btn btn-primary" style="border-radius:6px; min-width:110px;">Añadir</button>
            </div>
          </form>

          <div class="admin-table-wrap" style="box-shadow: none; border: 1px solid var(--color-border);">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Servicio</th>
                  <th>Duración</th>
                  <th>Precio</th>
                  <th style="text-align:right;">Acciones</th>
                </tr>
              </thead>
              <tbody>
                ${services.map((s: any) => `
                  <tr>
                    <td style="font-weight:600;">${s.name}</td>
                    <td>${s.duration} min</td>
                    <td style="color:var(--color-accent); font-weight:600;">$${s.price} USD</td>
                    <td style="text-align:right;">
                      <button class="btn btn-danger btn-sm" data-delete="${s._id}" style="border-radius:6px; padding:6px 12px;">Eliminar</button>
                    </td>
                  </tr>
                `).join('')}
                ${services.length === 0 ? '<tr><td colspan="4" class="empty-cell">No hay servicios registrados</td></tr>' : ''}
              </tbody>
            </table>
          </div>
        </div>

        <div class="admin-section">
          <h2>Reservas recientes</h2>
          <div class="admin-table-wrap" style="box-shadow: none; border: 1px solid var(--color-border);">
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
                    <td style="font-weight:600;">${b.clientName}</td>
                    <td>${b.date}</td>
                    <td>${b.time}</td>
                    <td>
                      <span class="status-${b.status.toLowerCase()}" style="font-size:11px; padding:3px 8px; border-radius:100px; text-transform:uppercase; font-weight:700;">
                        ${b.status}
                      </span>
                    </td>
                  </tr>
                `).join('')}
                ${bookings.length === 0 ? '<tr><td colspan="4" class="empty-cell">No hay citas en la agenda</td></tr>' : ''}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `
  }

  function renderDetailModal() {
    const proj = activeDetailProject
    return `
      <div id="modal-container" style="position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(15, 23, 42, 0.4); backdrop-filter:blur(6px); z-index:1000; display:flex; align-items:center; justify-content:center; padding:24px;">
        <div style="background:white; border-radius:16px; width:100%; max-width:960px; height:85vh; display:flex; flex-direction:column; overflow:hidden; box-shadow:0 24px 60px rgba(0,0,0,0.15); border: 1px solid var(--color-border-strong);">
          
          <!-- Modal Header -->
          <div style="display:flex; justify-content:space-between; align-items:center; padding:20px 28px; border-bottom:1px solid var(--color-border); background:white;">
            <div>
              <h2 style="margin:0 0 4px; font-size:20px; font-weight:800; letter-spacing:-0.02em;">${proj.businessName}</h2>
              <div style="font-size:13px; color:var(--color-ink-secondary); display:flex; align-items:center; gap:8px;">
                <span>${proj.niche}</span>
                <span>&bull;</span>
                <span>Estilo ${proj.webType}</span>
              </div>
            </div>
            <button id="close-modal-btn" class="btn btn-ghost" style="font-size:24px; padding:4px 12px; min-height:auto;">&times;</button>
          </div>

          <!-- Modal Body -->
          <div style="display:grid; grid-template-columns: 1fr 1fr; overflow:hidden; flex-grow:1;">
            
            <!-- Left Panel: Details -->
            <div style="padding:28px; border-right:1px solid var(--color-border); overflow-y:auto; display:flex; flex-direction:column; gap:20px;">
              <div>
                <label class="input-label" style="font-size:11px; text-transform:uppercase; letter-spacing:0.5px;">Estado del Proyecto</label>
                <select id="modal-status-select" class="input" style="height:40px; padding:0 12px; font-size:13px; border-radius:6px;">
                  <option value="Recibido" ${proj.status === 'Recibido' ? 'selected' : ''}>Recibido 📥</option>
                  <option value="En Diseño" ${proj.status === 'En Diseño' ? 'selected' : ''}>En Diseño 🎨</option>
                  <option value="En Desarrollo" ${proj.status === 'En Desarrollo' ? 'selected' : ''}>En Desarrollo 💻</option>
                  <option value="Completado" ${proj.status === 'Completado' ? 'selected' : ''}>Completado ✅</option>
                </select>
              </div>

              <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
                <div>
                  <label class="input-label" style="font-size:11px; text-transform:uppercase; letter-spacing:0.5px;">Plan Activo</label>
                  <span style="font-weight:700; text-transform:uppercase; font-size:13px; color:${proj.plan === 'base' ? 'var(--color-accent)' : '#a855f7'}; background:${proj.plan === 'base' ? 'var(--color-accent-muted)' : 'rgba(168,85,247,0.08)'}; padding:4px 12px; border-radius:100px; display:inline-block;">
                    ${proj.plan}
                  </span>
                </div>
                <div>
                  <label class="input-label" style="font-size:11px; text-transform:uppercase; letter-spacing:0.5px;">WhatsApp del Cliente</label>
                  <a href="https://wa.me/${proj.whatsapp.replace(/[^0-9]/g, '')}" target="_blank" style="color:var(--color-success); font-weight:600; display:inline-flex; align-items:center; gap:4px; font-size:13px; text-decoration:underline;">
                    ${proj.whatsapp}
                  </a>
                </div>
              </div>

              <div>
                <label class="input-label" style="font-size:11px; text-transform:uppercase; letter-spacing:0.5px;">Servicios Solicitados</label>
                <pre style="background:var(--color-surface-0); border-radius:8px; padding:16px; font-family:monospace; font-size:12px; white-space:pre-wrap; margin:0; line-height:1.6; border:1px solid var(--color-border-strong);">${proj.services}</pre>
              </div>

              <div>
                <label class="input-label" style="font-size:11px; text-transform:uppercase; letter-spacing:0.5px;">Comentarios de Diseño</label>
                <p style="font-size:13px; color:var(--color-ink-secondary); line-height:1.6; margin:0; background:#fafafa; padding:12px; border-radius:8px; border:1px solid var(--color-border);">${proj.notes || 'Sin especificaciones adicionales.'}</p>
              </div>
            </div>

            <!-- Right Panel: CRM Chat -->
            <div style="display:flex; flex-direction:column; background:var(--color-surface-0); height:100%; overflow:hidden;">
              <div style="padding:14px 20px; border-bottom:1px solid var(--color-border); background:white; font-size:12px; font-weight:700; color:var(--color-ink-secondary); display:flex; justify-content:space-between; align-items:center;">
                <span>HISTORIAL DE CLIENTE</span>
                <span style="background:var(--color-success-muted); color:var(--color-success); font-size:10px; padding:2px 8px; border-radius:100px;">Chat Activo</span>
              </div>

              <!-- Message History -->
              <div id="chat-messages-container" style="flex-grow:1; padding:20px; overflow-y:auto; display:flex; flex-direction:column; gap:16px; background:#f8fafc;">
                ${proj.chatHistory.map((msg: any) => `
                  <div style="max-width:80%; align-self: ${msg.sender === 'admin' ? 'flex-end' : 'flex-start'};">
                    <div style="background: ${msg.sender === 'admin' ? 'var(--color-accent)' : 'white'}; color: ${msg.sender === 'admin' ? 'white' : 'var(--color-ink)'}; padding:10px 14px; border-radius: ${msg.sender === 'admin' ? '12px 12px 0 12px' : '12px 12px 12px 0'}; font-size:13px; border: 1px solid ${msg.sender === 'admin' ? 'transparent' : 'var(--color-border)'}; box-shadow:0 1px 3px rgba(0,0,0,0.02); line-height:1.5;">
                      ${msg.message}
                    </div>
                    <div style="text-align: ${msg.sender === 'admin' ? 'right' : 'left'}; font-size:10px; color:var(--color-ink-muted); margin-top:4px; padding:0 4px;">
                      ${msg.time}
                    </div>
                  </div>
                `).join('')}
              </div>

              <!-- Chat Input -->
              <form id="chat-input-form" style="padding:16px; border-top:1px solid var(--color-border); background:white; display:flex; gap:10px;">
                <input type="text" id="chat-message-input" class="input" style="height:42px; font-size:13px; border-radius:6px;" placeholder="Escribe un mensaje..." required />
                <button type="submit" class="btn btn-primary" style="padding:0 20px; font-size:13px; height:42px; min-height:auto; border-radius:6px; box-shadow:none;">Enviar</button>
              </form>
            </div>
            
          </div>
        </div>
      </div>
    `
  }

  function setupEventListeners() {
    // Tab switching
    container.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        currentTab = btn.getAttribute('data-tab') || 'projects'
        localStorage.setItem('admin_current_tab', currentTab)
        updateView()
      })
    })

    if (currentTab === 'projects') {
      // Filters
      const nicheSelect = container.querySelector('#filter-niche') as HTMLSelectElement
      if (nicheSelect) {
        nicheSelect.addEventListener('change', () => {
          filterNiche = nicheSelect.value
          updateView()
        })
      }

      const planSelect = container.querySelector('#filter-plan') as HTMLSelectElement
      if (planSelect) {
        planSelect.addEventListener('change', () => {
          filterPlan = planSelect.value
          updateView()
        })
      }

      // Kanban card modal open
      container.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('click', (e) => {
          const target = e.target as HTMLElement
          if (target.closest('.move-btn')) return

          const id = card.getAttribute('data-id')!
          activeDetailProject = projects.find(p => p.id === id) || null
          updateView()

          // Scroll chat
          const chatContainer = container.querySelector('#chat-messages-container')
          if (chatContainer) chatContainer.scrollTop = chatContainer.scrollHeight
        })
      })

      // Move action buttons
      container.querySelectorAll('.move-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation()
          const id = btn.getAttribute('data-id')!
          const toStatus = btn.getAttribute('data-to')!
          const targetProj = projects.find(p => p.id === id)
          if (targetProj) {
            targetProj.status = toStatus
            localStorage.setItem(`project_${id}`, JSON.stringify(targetProj))
            updateView()
          }
        })
      })
    } else {
      // Form submit for new service
      const form = container.querySelector('#service-form')
      if (form) {
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
      }

      // Delete service
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

    // Modal Close
    const closeModalBtn = container.querySelector('#close-modal-btn')
    if (closeModalBtn) {
      closeModalBtn.addEventListener('click', () => {
        activeDetailProject = null
        updateView()
      })
    }

    const modalContainer = container.querySelector('#modal-container')
    if (modalContainer) {
      modalContainer.addEventListener('click', (e) => {
        if (e.target === modalContainer) {
          activeDetailProject = null
          updateView()
        }
      })
    }

    // Status change in modal
    const modalStatusSelect = container.querySelector('#modal-status-select') as HTMLSelectElement
    if (modalStatusSelect && activeDetailProject) {
      modalStatusSelect.addEventListener('change', () => {
        activeDetailProject.status = modalStatusSelect.value
        localStorage.setItem(`project_${activeDetailProject.id}`, JSON.stringify(activeDetailProject))
        
        // Sync project array
        const idx = projects.findIndex(p => p.id === activeDetailProject.id)
        if (idx !== -1) projects[idx] = activeDetailProject
        updateView()
      })
    }

    // CRM Chat message submit
    const chatForm = container.querySelector('#chat-input-form')
    if (chatForm && activeDetailProject) {
      chatForm.addEventListener('submit', (e) => {
        e.preventDefault()
        const input = container.querySelector('#chat-message-input') as HTMLInputElement
        const text = input.value.trim()
        if (!text) return

        const newMsg = {
          sender: 'admin',
          message: text,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }

        activeDetailProject.chatHistory.push(newMsg)
        localStorage.setItem(`project_${activeDetailProject.id}`, JSON.stringify(activeDetailProject))
        
        const idx = projects.findIndex(p => p.id === activeDetailProject.id)
        if (idx !== -1) projects[idx] = activeDetailProject
        
        updateView()

        // Scroll chat
        const chatContainer = container.querySelector('#chat-messages-container')
        if (chatContainer) chatContainer.scrollTop = chatContainer.scrollHeight
      })
    }
  }

  updateView()
}
