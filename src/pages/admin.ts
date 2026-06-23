import { fetchServices, getBookings, createService, deleteService } from '../lib/api.js'

export async function renderAdmin(container: HTMLDivElement) {
  const loggedInUser = localStorage.getItem('logged_in_user')
  if (loggedInUser !== 'admin@chamba.digital') {
    container.innerHTML = `
      <nav class="navbar scrolled">
        <div class="container nav-inner">
          <a href="#/" class="logo">chamba<span>.digital</span></a>
        </div>
      </nav>
      <section class="booking-page" style="margin-top: 120px; text-align: center; display: flex; align-items: center; justify-content: center; min-height: 60vh;">
        <div class="container" style="max-width: 480px; width: 100%;">
          <div class="sub-form-card" style="padding: 40px; border: 1px solid var(--color-border); border-radius: 16px; background: white; box-shadow: 0 10px 30px rgba(0,0,0,0.03);">
            <div style="display: inline-flex; align-items: center; justify-content: center; width: 56px; height: 56px; background: #fee2e2; color: #ef4444; border-radius: 50%; margin-bottom: 20px;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
            <h2 style="font-weight: 800; font-size: 22px; margin-bottom: 12px; letter-spacing: -0.02em;">Acceso de Administrador Requerido</h2>
            <p style="color: var(--color-ink-secondary); font-size: 14px; margin-bottom: 24px; line-height: 1.5;">
              Esta sección está reservada para el super admin. Por favor inicia sesión con tu cuenta de administrador.
            </p>
            <a href="#/login" class="btn btn-primary btn-block" style="height: 44px; display: flex; align-items: center; justify-content: center;">Iniciar Sesión como Admin</a>
          </div>
        </div>
      </section>
    `
    return
  }

  container.innerHTML = `<div class="loader">Cargando panel...</div>`

  let services: any[] = []
  let bookings: any[] = []
  let projects: any[] = []

  try {
    const projectsResponse = await fetch('/api/projects')
    if (projectsResponse.ok) {
      projects = await projectsResponse.json()
    }
    ;[services, bookings] = await Promise.all([fetchServices(), getBookings()])
  } catch (err) {
    console.error(err)
    services = []
    bookings = []
    projects = []
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
            <button id="admin-logout-btn" class="btn btn-outline btn-sm" style="border-radius:6px; padding: 8px 14px;">Cerrar sesión</button>
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
      <div class="admin-page-header" style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:16px;">
        <div>
          <h1>Gestión de Cuentas</h1>
          <p>Tablero de control y CRM integrado para proyectos activos.</p>
        </div>
        
        <div style="display:flex; gap:12px; flex-wrap:wrap; align-items:center;">
          <div class="form-field">
            <label class="input-label">Nicho</label>
            <select id="filter-niche" class="input" style="height:40px; min-width:140px; padding:0 12px; font-size:13px;">
              <option value="all" ${filterNiche === 'all' ? 'selected' : ''}>Todos</option>
              <option value="Peluquerías" ${filterNiche === 'Peluquerías' ? 'selected' : ''}>Barberías</option>
              <option value="Consultorios" ${filterNiche === 'Consultorios' ? 'selected' : ''}>Consultorios</option>
              <option value="Spas & Estética" ${filterNiche === 'Spas & Estética' ? 'selected' : ''}>Spas</option>
              <option value="Gimnasios" ${filterNiche === 'Gimnasios' ? 'selected' : ''}>Gimnasios</option>
              <option value="Inmobiliarias & Realtors" ${filterNiche === 'Inmobiliarias & Realtors' ? 'selected' : ''}>Inmobiliarias</option>
              <option value="Talleres mecánicos" ${filterNiche === 'Talleres mecánicos' ? 'selected' : ''}>Talleres</option>
            </select>
          </div>

          <div class="form-field">
            <label class="input-label">Plan</label>
            <select id="filter-plan" class="input" style="height:40px; min-width:120px; padding:0 12px; font-size:13px;">
              <option value="all" ${filterPlan === 'all' ? 'selected' : ''}>Todos</option>
              <option value="base" ${filterPlan === 'base' ? 'selected' : ''}>Plan Base</option>
              <option value="dedicado" ${filterPlan === 'dedicado' ? 'selected' : ''}>Plan Dedicado</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Kanban Grid -->
      <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:16px; overflow-x:auto;">
        ${columns.map(col => {
          const colProjects = filtered.filter(p => p.status === col.key)
          return `
              <div style="background:var(--color-surface-0); border:1px solid var(--color-border); border-radius:var(--radius-card); padding:16px; min-height:400px; display:flex; flex-direction:column; gap:12px;">
              <div style="display:flex; justify-content:space-between; align-items:center; padding-bottom:12px; border-bottom:1px solid var(--color-border);">
                <div style="display:flex; align-items:center; gap:8px;">
                  <span style="font-size:14px;">${col.icon}</span>
                  <span style="font-size:13px; font-weight:700; color:var(--color-ink);">${col.title}</span>
                </div>
                <span style="background:var(--color-surface-3); color:var(--color-ink-secondary); font-size:11px; padding:2px 8px; border-radius:var(--radius-pill); font-weight:700;">${colProjects.length}</span>
              </div>
              
              <div style="display:flex; flex-direction:column; gap:12px; flex-grow:1;">
                ${colProjects.map(proj => {
                  const projId = proj._id || proj.id
                  return `
                    <div class="project-card" data-id="${projId}" style="background:white; border:1px solid var(--color-border-strong); border-radius:10px; padding:14px; cursor:pointer; transition:transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease; box-shadow:0 1px 2px rgba(0,0,0,0.03);">
                      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px;">
                        <span style="font-size:10px; font-weight:700; text-transform:uppercase; padding:3px 8px; border-radius:var(--radius-pill); background:${proj.plan === 'base' ? 'var(--color-accent-muted)' : 'rgba(168, 85, 247, 0.08)'}; color:${proj.plan === 'base' ? 'var(--color-accent)' : '#a855f7'};">
                          Plan ${proj.plan}
                        </span>
                        <span style="font-size:11px; color:var(--color-ink-muted);">${new Date(proj.createdAt).toLocaleDateString()}</span>
                      </div>
                      
                      <h4 style="font-size:13px; font-weight:700; margin:0 0 4px; color:var(--color-ink);">${proj.businessName}</h4>
                      <p style="font-size:11px; color:var(--color-ink-secondary); margin:0 0 12px; line-height:1.4;">${proj.niche} &bull; Web ${proj.webType}</p>
                      
                      <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--color-border); padding-top:10px;">
                        <span style="font-size:11px; color:var(--color-accent); font-weight:600; display:inline-flex; align-items:center; gap:4px;">
                          Ver ficha &rarr;
                        </span>
                        
                        <div style="display:flex; gap:4px;">
                          ${col.key !== 'Recibido' ? `
                            <button class="move-btn" data-id="${projId}" data-to="${columns[columns.findIndex(c => c.key === col.key) - 1].key}" style="border:1px solid var(--color-border); background:white; color:var(--color-ink-secondary); width:28px; height:28px; border-radius:var(--radius-xs); cursor:pointer; font-size:12px; display:flex; align-items:center; justify-content:center; transition:all 0.2s ease;" onmouseover="this.style.borderColor='var(--color-accent)';this.style.color='var(--color-accent)'" onmouseout="this.style.borderColor='var(--color-border)';this.style.color='var(--color-ink-secondary)'">
                              &larr;
                            </button>
                          ` : ''}
                          ${col.key !== 'Completado' ? `
                            <button class="move-btn" data-id="${projId}" data-to="${columns[columns.findIndex(c => c.key === col.key) + 1].key}" style="border:1px solid var(--color-border); background:white; color:var(--color-ink-secondary); width:28px; height:28px; border-radius:var(--radius-xs); cursor:pointer; font-size:12px; display:flex; align-items:center; justify-content:center; transition:all 0.2s ease;" onmouseover="this.style.borderColor='var(--color-accent)';this.style.color='var(--color-accent)'" onmouseout="this.style.borderColor='var(--color-border)';this.style.color='var(--color-ink-secondary)'">
                              &rarr;
                            </button>
                          ` : ''}
                        </div>
                      </div>
                    </div>
                  `
                }).join('')}
                ${colProjects.length === 0 ? `
                  <div style="font-size:12px; color:var(--color-ink-muted); text-align:center; padding:32px 16px; border:1px dashed var(--color-border); border-radius:10px; background:rgba(255,255,255,0.4);">
                    Sin proyectos
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
      <div class="admin-page-header">
        <h1>Configuración del Motor</h1>
        <p>Edita el menú de servicios y revisa las citas del calendario cliente.</p>
      </div>

      <div class="admin-grid">
        <div class="admin-section">
          <h2>Agregar Servicio</h2>
          <form id="service-form" class="admin-form">
            <div class="form-field admin-form-full">
              <label class="input-label">Nombre del servicio</label>
              <input type="text" id="svc-name" class="input" placeholder="Ej. Corte Clásico" required />
            </div>
            <div class="admin-form-grid">
              <div class="form-field">
                <label class="input-label">Duración (min)</label>
                <input type="number" id="svc-duration" class="input" placeholder="30" required />
              </div>
              <div class="form-field">
                <label class="input-label">Precio (USD)</label>
                <input type="number" id="svc-price" class="input" placeholder="25" required />
              </div>
              <div class="form-field">
                <label class="input-label">Polar Product ID</label>
                <input type="text" id="svc-polar" class="input" placeholder="Opcional" />
              </div>
              <button type="submit" class="btn btn-primary" style="height:44px; padding:0 24px;">Añadir</button>
            </div>
            <div class="form-field admin-form-full">
              <label class="input-label">Descripción</label>
              <input type="text" id="svc-desc" class="input" placeholder="Descripción breve del servicio" required />
            </div>
          </form>
        </div>

        <div class="admin-section">
          <h2>Servicios Registrados</h2>
          <div class="admin-table-wrap">
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
          <h2>Reservas Recientes</h2>
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
    const projId = proj._id || proj.id
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

    const logoutBtn = container.querySelector('#admin-logout-btn')
    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault()
        localStorage.removeItem('logged_in_user')
        window.location.hash = '#/'
      })
    }

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
          activeDetailProject = projects.find(p => (p._id || p.id) === id) || null
          updateView()

          // Scroll chat
          const chatContainer = container.querySelector('#chat-messages-container')
          if (chatContainer) chatContainer.scrollTop = chatContainer.scrollHeight
        })
      })

      // Move action buttons
      container.querySelectorAll('.move-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          e.stopPropagation()
          const id = btn.getAttribute('data-id')!
          const toStatus = btn.getAttribute('data-to')!
          
          try {
            const res = await fetch(`/api/projects/${id}/status`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ status: toStatus })
            })
            if (!res.ok) throw new Error('Fallo al actualizar en MongoDB')
            
            // Reload projects from server
            const projectsResponse = await fetch('/api/projects')
            if (projectsResponse.ok) {
              projects = await projectsResponse.json()
            }
            updateView()
          } catch (err) {
            console.error(err)
            alert('Error al mover el proyecto')
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
      modalStatusSelect.addEventListener('change', async () => {
        const toStatus = modalStatusSelect.value
        const projId = activeDetailProject._id || activeDetailProject.id
        
        try {
          const res = await fetch(`/api/projects/${projId}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: toStatus })
          })
          if (!res.ok) throw new Error('Fallo al actualizar')
          
          const updated = await res.json()
          activeDetailProject = updated
          
          // Refresh list
          const projectsResponse = await fetch('/api/projects')
          if (projectsResponse.ok) {
            projects = await projectsResponse.json()
          }
          updateView()
        } catch (err) {
          console.error(err)
          alert('Error al actualizar el estado del proyecto')
        }
      })
    }

    // CRM Chat message submit
    const chatForm = container.querySelector('#chat-input-form')
    if (chatForm && activeDetailProject) {
      chatForm.addEventListener('submit', async (e) => {
        e.preventDefault()
        const input = container.querySelector('#chat-message-input') as HTMLInputElement
        const text = input.value.trim()
        if (!text) return

        const projId = activeDetailProject._id || activeDetailProject.id

        try {
          const res = await fetch(`/api/projects/${projId}/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sender: 'admin', message: text })
          })
          if (!res.ok) throw new Error('Fallo al enviar mensaje')
          
          const updated = await res.json()
          activeDetailProject = updated
          
          // Refresh list
          const projectsResponse = await fetch('/api/projects')
          if (projectsResponse.ok) {
            projects = await projectsResponse.json()
          }
          updateView()

          // Scroll chat
          const chatContainer = container.querySelector('#chat-messages-container')
          if (chatContainer) chatContainer.scrollTop = chatContainer.scrollHeight
        } catch (err) {
          console.error(err)
          alert('Error al enviar el mensaje de chat')
        }
      })
    }
  }

  updateView()
}
