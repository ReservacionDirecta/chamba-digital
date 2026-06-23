export function renderMyProject(container: HTMLDivElement) {
  const loggedInUser = localStorage.getItem('logged_in_user')
  
  if (!loggedInUser) {
    container.innerHTML = `
      <nav class="navbar scrolled">
        <div class="container nav-inner">
          <a href="#/" class="logo">chamba<span>.digital</span></a>
        </div>
      </nav>
      <section class="booking-page" style="margin-top: 120px; text-align: center; display: flex; align-items: center; justify-content: center; min-height: 60vh;">
        <div class="container" style="max-width: 480px; width: 100%;">
          <div class="sub-form-card" style="padding: 40px; border: 1px solid var(--color-border); border-radius: 16px; background: white; box-shadow: 0 10px 30px rgba(0,0,0,0.03);">
            <div style="display: inline-flex; align-items: center; justify-content: center; width: 56px; height: 56px; background: #fef3c7; color: #d97706; border-radius: 50%; margin-bottom: 20px;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
            <h2 style="font-weight: 800; font-size: 22px; margin-bottom: 12px; letter-spacing: -0.02em;">Acceso Restringido</h2>
            <p style="color: var(--color-ink-secondary); font-size: 14px; margin-bottom: 24px; line-height: 1.5;">
              Debes iniciar sesión con tu cuenta de cliente para acceder y configurar tu proyecto web.
            </p>
            <a href="#/login" class="btn btn-primary btn-block" style="height: 44px; display: flex; align-items: center; justify-content: center;">Iniciar Sesión</a>
          </div>
        </div>
      </section>
    `
    return
  }

  // Get active subscription data to auto-fill
  let activeSub = { name: '', email: '', businessName: '', phone: '', plan: 'base' }
  try {
    const rawSub = localStorage.getItem('last_subscription')
    if (rawSub) activeSub = JSON.parse(rawSub)
  } catch {}

  // Check if there is already a project for this business (using logged in user email as ID)
  let existingProject = {
    id: loggedInUser,
    businessName: activeSub.businessName || '',
    niche: 'Peluquerías',
    webType: 'Moderna',
    services: 'Corte de cabello (30 min - $15)\nManicura (45 min - $25)',
    whatsapp: activeSub.phone || '',
    notes: '',
    plan: activeSub.plan || 'base',
    status: 'Recibido',
    createdAt: new Date().toLocaleDateString(),
    chatHistory: [
      { sender: 'admin', message: '¡Hola! Bienvenido a chamba.digital. Ya recibimos tu solicitud. Completa los datos de este formulario para comenzar a diseñar tu web.', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]
  }

  try {
    const rawProj = localStorage.getItem(`project_${loggedInUser}`)
    if (rawProj) {
      existingProject = JSON.parse(rawProj)
    }
  } catch {}

  container.innerHTML = `
    <nav class="navbar scrolled">
      <div class="container nav-inner" style="display: flex; justify-content: space-between; align-items: center;">
        <a href="#/" class="logo" style="color:var(--color-ink)">chamba<span>.digital</span></a>
        
        <div style="display: flex; align-items: center; gap: 16px;">
          <span style="font-size: 13px; color: var(--color-ink-secondary); font-weight: 500; background: var(--color-surface-1); padding: 6px 12px; border-radius: 6px; border: 1px solid var(--color-border);">
            👤 ${loggedInUser}
          </span>
          <button id="logout-btn" class="btn btn-outline btn-sm" style="border-radius: 6px; height: 32px; padding: 0 12px; font-size: 12px;">
            Cerrar Sesión
          </button>
        </div>
      </div>
    </nav>

    <section class="booking-page" style="margin-top: 96px; padding-bottom: 80px;">
      <div class="container" style="max-width: 760px;">
        
        <div style="margin-bottom: 32px;">
          <h1 style="font-size: 32px; font-weight: 800; letter-spacing: -0.03em; margin-bottom: 8px;">Configura tu Sitio Web</h1>
          <p style="color: var(--color-ink-secondary); font-size: 15px; margin: 0; line-height: 1.5;">
            Completa la ficha técnica inicial de tu negocio. Nuestro equipo utilizará estos datos para estructurar tu motor de reservas.
          </p>
        </div>

        <div class="sub-form-card" style="border: 1px solid var(--color-border); box-shadow: 0 4px 20px rgba(0,0,0,0.02); background: white; border-radius: 16px; padding: 32px;">
          <form id="project-form" style="display:flex; flex-direction:column; gap: 24px;">
            
            <div style="border-bottom: 1px solid var(--color-border); padding-bottom: 16px; margin-bottom: 8px;">
              <h3 style="font-size: 16px; font-weight: 700; color: var(--color-ink); margin-bottom: 4px;">1. Datos Básicos</h3>
              <p style="font-size: 13px; color: var(--color-ink-muted); margin: 0;">Identificación pública de tu negocio.</p>
            </div>

            <div class="form-grid" style="margin-bottom: 4px;">
              <div class="form-group">
                <label class="input-label" style="font-weight: 600; font-size: 13px;">Nombre comercial del negocio</label>
                <input type="text" id="proj-business" class="input" value="${existingProject.businessName}" placeholder="Ej. Barbería El Elegante" required />
              </div>
              <div class="form-group">
                <label class="input-label" style="font-weight: 600; font-size: 13px;">Sector o Nicho principal</label>
                <select id="proj-niche" class="input" style="height: 48px; background-image: none; cursor: pointer;">
                  <option value="Peluquerías" ${existingProject.niche === 'Peluquerías' ? 'selected' : ''}>Peluquerías & Barberías</option>
                  <option value="Consultorios" ${existingProject.niche === 'Consultorios' ? 'selected' : ''}>Consultorios & Médicos</option>
                  <option value="Spas & Estética" ${existingProject.niche === 'Spas & Estética' ? 'selected' : ''}>Spas & Estética</option>
                  <option value="Gimnasios" ${existingProject.niche === 'Gimnasios' ? 'selected' : ''}>Gimnasios & Fitness</option>
                  <option value="Inmobiliarias & Realtors" ${existingProject.niche === 'Inmobiliarias & Realtors' ? 'selected' : ''}>Inmobiliarias & Realtors</option>
                  <option value="Talleres mecánicos" ${existingProject.niche === 'Talleres mecánicos' ? 'selected' : ''}>Talleres mecánicos</option>
                  <option value="Clases particulares" ${existingProject.niche === 'Clases particulares' ? 'selected' : ''}>Clases & Academias</option>
                  <option value="Otros" ${existingProject.niche === 'Otros' ? 'selected' : ''}>Otros servicios</option>
                </select>
              </div>
            </div>

            <div style="border-bottom: 1px solid var(--color-border); padding-bottom: 16px; margin-bottom: 8px; margin-top: 8px;">
              <h3 style="font-size: 16px; font-weight: 700; color: var(--color-ink); margin-bottom: 4px;">2. Estilo y Funciones</h3>
              <p style="font-size: 13px; color: var(--color-ink-muted); margin: 0;">Define la experiencia y apariencia del sitio.</p>
            </div>

            <div class="form-grid" style="margin-bottom: 4px;">
              <div class="form-group">
                <label class="input-label" style="font-weight: 600; font-size: 13px;">Estilo estético</label>
                <select id="proj-webtype" class="input" style="height: 48px; background-image: none; cursor: pointer;">
                  <option value="Moderna" ${existingProject.webType === 'Moderna' ? 'selected' : ''}>Moderna (Gradientes finos, limpia, fluida)</option>
                  <option value="Minimalista" ${existingProject.webType === 'Minimalista' ? 'selected' : ''}>Minimalista (Monocromática, elegante, espaciada)</option>
                  <option value="Corporativa" ${existingProject.webType === 'Corporativa' ? 'selected' : ''}>Corporativa (Profesional, estructurada, seria)</option>
                </select>
              </div>
              <div class="form-group">
                <label class="input-label" style="font-weight: 600; font-size: 13px;">WhatsApp (para notificaciones y alertas)</label>
                <input type="tel" id="proj-whatsapp" class="input" value="${existingProject.whatsapp}" placeholder="+52 123 456 7890" required />
              </div>
            </div>

            <div class="form-group">
              <label class="input-label" style="font-weight: 600; font-size: 13px;">Servicios a agendar (Nombre del servicio - Duración - Precio)</label>
              <textarea id="proj-services" class="input" rows="4" style="resize: vertical; font-family: 'Courier New', Courier, monospace; font-size: 13px; line-height: 1.6; padding: 14px 18px;" placeholder="Ej.&#10;Corte Clásico - 30 min - $15&#10;Tratamiento Capilar - 45 min - $30" required>${existingProject.services}</textarea>
            </div>

            <div class="form-group">
              <label class="input-label" style="font-weight: 600; font-size: 13px;">Colores preferidos o comentarios de diseño</label>
              <textarea id="proj-notes" class="input" rows="3" style="resize: vertical; padding: 14px 18px;" placeholder="Ej. Prefiero tonos azules oscuros con blanco. Logotipo en formato PNG de alta resolución...">${existingProject.notes}</textarea>
            </div>

            <div style="display:flex; justify-content:space-between; align-items:center; margin-top: 12px; padding-top: 20px; border-top:1px solid var(--color-border); flex-wrap:wrap; gap:16px;">
              <div style="display:flex; align-items:center; gap:8px;">
                <span style="font-size:13px; color:var(--color-ink-muted);">Estado del sitio:</span>
                <span class="status-${existingProject.status.toLowerCase().replace(' ', '-')}" style="font-size: 12px; font-weight: 700; padding: 4px 10px; border-radius: 100px; text-transform: uppercase;">
                  ${existingProject.status}
                </span>
              </div>

              <div class="step-actions" style="margin: 0;">
                <button type="submit" class="btn btn-primary btn-lg" style="box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);">
                  Guardar y Enviar Solicitud
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  `

  const form = container.querySelector('#project-form') as HTMLFormElement
  form.addEventListener('submit', (e) => {
    e.preventDefault()

    const businessName = (container.querySelector('#proj-business') as HTMLInputElement).value
    const niche = (container.querySelector('#proj-niche') as HTMLSelectElement).value
    const webType = (container.querySelector('#proj-webtype') as HTMLSelectElement).value
    const whatsapp = (container.querySelector('#proj-whatsapp') as HTMLInputElement).value
    const services = (container.querySelector('#proj-services') as HTMLTextAreaElement).value
    const notes = (container.querySelector('#proj-notes') as HTMLTextAreaElement).value

    // Update project
    existingProject.businessName = businessName
    existingProject.niche = niche
    existingProject.webType = webType
    existingProject.whatsapp = whatsapp
    existingProject.services = services
    existingProject.notes = notes

    // Save to projects registry
    localStorage.setItem(`project_${loggedInUser}`, JSON.stringify(existingProject))

    // Also register in the active projects list
    const activeProjects = JSON.parse(localStorage.getItem('active_projects_list') || '[]')
    if (!activeProjects.includes(loggedInUser)) {
      activeProjects.push(loggedInUser)
      localStorage.setItem('active_projects_list', JSON.stringify(activeProjects))
    }

    alert('¡Configuración guardada con éxito! El administrador ha recibido tu solicitud en el panel.')
  })

  // Logout button handler
  const logoutBtn = container.querySelector('#logout-btn') as HTMLButtonElement
  logoutBtn.addEventListener('click', (e) => {
    e.preventDefault()
    localStorage.removeItem('logged_in_user')
    window.location.hash = '#/'
  })
}
