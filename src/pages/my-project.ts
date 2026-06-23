export async function renderMyProject(container: HTMLDivElement) {
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

  // Show loading indicator
  container.innerHTML = `
    <nav class="navbar scrolled">
      <div class="container nav-inner">
        <a href="#/" class="logo">chamba<span>.digital</span></a>
      </div>
    </nav>
    <div class="loader">Cargando configuración del proyecto...</div>
  `

  try {
    const response = await fetch('/api/projects/my', {
      headers: {
        'x-user-email': loggedInUser
      }
    })

    if (!response.ok) {
      throw new Error('No se pudo obtener el proyecto')
    }

    const project = await response.json()
    renderProjectView(container, project, loggedInUser)
  } catch (err) {
    console.error(err)
    container.innerHTML = `
      <nav class="navbar scrolled">
        <div class="container nav-inner">
          <a href="#/" class="logo">chamba<span>.digital</span></a>
        </div>
      </nav>
      <section class="booking-page" style="margin-top: 120px; text-align: center;">
        <div class="container" style="max-width: 480px;">
          <div class="sub-form-card" style="padding: 40px; border: 1px solid var(--color-border); border-radius: 16px; background: white;">
            <h2 style="color: var(--color-error); font-size: 20px; margin-bottom: 12px;">Error de Conexión</h2>
            <p style="color: var(--color-ink-secondary); font-size: 14px; margin-bottom: 20px;">
              No se pudo conectar con el servidor para cargar tu proyecto.
            </p>
            <button onclick="window.location.reload()" class="btn btn-primary">Reintentar</button>
          </div>
        </div>
      </section>
    `
  }
}

function renderProjectView(container: HTMLDivElement, project: any, loggedInUser: string) {
  const isDedicado = project.plan === 'dedicado'
  
  container.innerHTML = `
    <nav class="navbar scrolled">
      <div class="container nav-inner" style="display: flex; justify-content: space-between; align-items: center;">
        <a href="#/" class="logo" style="color:var(--color-ink)">chamba<span>.digital</span></a>
        
        <div style="display: flex; align-items: center; gap: 16px;">
          <span class="user-email-tag" style="font-size: 13px; color: var(--color-ink-secondary); font-weight: 500; background: var(--color-surface-1); padding: 6px 12px; border-radius: 6px; border: 1px solid var(--color-border);">
            👤 ${loggedInUser}
          </span>
          <button id="logout-btn" class="btn btn-outline btn-sm" style="border-radius: 6px; height: 32px; padding: 0 12px; font-size: 12px;">
            Cerrar Sesión
          </button>
        </div>
      </div>
    </nav>

    <section class="booking-page" style="margin-top: 96px; padding-bottom: 80px;">
      <div class="container" style="max-width: 1200px;">
        
        <div style="margin-bottom: 32px;">
          <h1 style="font-size: 32px; font-weight: 800; letter-spacing: -0.03em; margin-bottom: 8px;">Portal de Cliente</h1>
          <p style="color: var(--color-ink-secondary); font-size: 15px; margin: 0; line-height: 1.5;">
            Gestiona la ficha técnica de tu negocio y mantén comunicación directa con el equipo técnico de chamba.digital.
          </p>
        </div>

        <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 32px; align-items: start;" class="features-grid">
          
          <!-- Left Column: Project Form & Roadmap -->
          <div style="display: flex; flex-direction: column; gap: 24px;">
            <div class="sub-form-card" style="border: 1px solid var(--color-border); box-shadow: 0 4px 20px rgba(0,0,0,0.02); background: white; border-radius: 16px; padding: 32px;">
              <form id="project-form" style="display:flex; flex-direction:column; gap: 24px;">
                
                <div style="border-bottom: 1px solid var(--color-border); padding-bottom: 16px; margin-bottom: 8px;">
                  <h3 style="font-size: 16px; font-weight: 700; color: var(--color-ink); margin-bottom: 4px;">1. Datos Básicos</h3>
                  <p style="font-size: 13px; color: var(--color-ink-muted); margin: 0;">Identificación pública de tu negocio.</p>
                </div>

                <div class="form-grid" style="margin-bottom: 4px;">
                  <div class="form-group" style="display:flex; flex-direction:column; gap:6px;">
                    <label class="input-label" style="font-weight: 600; font-size: 13px;">Nombre comercial</label>
                    <input type="text" id="proj-business" class="input" value="${project.businessName || ''}" placeholder="Ej. Barbería El Elegante" required />
                  </div>
                  <div class="form-group" style="display:flex; flex-direction:column; gap:6px;">
                    <label class="input-label" style="font-weight: 600; font-size: 13px;">Sector o Nicho principal</label>
                    <select id="proj-niche" class="input" style="height: 48px; background-image: none; cursor: pointer;">
                      <option value="Peluquerías" ${project.niche === 'Peluquerías' ? 'selected' : ''}>Peluquerías & Barberías</option>
                      <option value="Consultorios" ${project.niche === 'Consultorios' ? 'selected' : ''}>Consultorios & Médicos</option>
                      <option value="Spas & Estética" ${project.niche === 'Spas & Estética' ? 'selected' : ''}>Spas & Estética</option>
                      <option value="Gimnasios" ${project.niche === 'Gimnasios' ? 'selected' : ''}>Gimnasios & Fitness</option>
                      <option value="Inmobiliarias & Realtors" ${project.niche === 'Inmobiliarias & Realtors' ? 'selected' : ''}>Inmobiliarias & Realtors</option>
                      <option value="Talleres mecánicos" ${project.niche === 'Talleres mecánicos' ? 'selected' : ''}>Talleres mecánicos</option>
                      <option value="Clases particulares" ${project.niche === 'Clases particulares' ? 'selected' : ''}>Clases & Academias</option>
                      <option value="Otros" ${project.niche === 'Otros' ? 'selected' : ''}>Otros servicios</option>
                    </select>
                  </div>
                </div>

                <div style="border-bottom: 1px solid var(--color-border); padding-bottom: 16px; margin-bottom: 8px; margin-top: 8px;">
                  <h3 style="font-size: 16px; font-weight: 700; color: var(--color-ink); margin-bottom: 4px;">2. Estilo y Funciones</h3>
                  <p style="font-size: 13px; color: var(--color-ink-muted); margin: 0;">Define la experiencia y apariencia del sitio.</p>
                </div>

                <div class="form-grid" style="margin-bottom: 4px;">
                  <div class="form-group" style="display:flex; flex-direction:column; gap:6px;">
                    <label class="input-label" style="font-weight: 600; font-size: 13px;">Estilo estético</label>
                    <select id="proj-webtype" class="input" style="height: 48px; background-image: none; cursor: pointer;">
                      <option value="Moderna" ${project.webType === 'Moderna' ? 'selected' : ''}>Moderna (Gradientes, limpia)</option>
                      <option value="Minimalista" ${project.webType === 'Minimalista' ? 'selected' : ''}>Minimalista (Monocromo, elegante)</option>
                      <option value="Corporativa" ${project.webType === 'Corporativa' ? 'selected' : ''}>Corporativa (Seria, profesional)</option>
                    </select>
                  </div>
                  <div class="form-group" style="display:flex; flex-direction:column; gap:6px;">
                    <label class="input-label" style="font-weight: 600; font-size: 13px;">WhatsApp de notificaciones</label>
                    <input type="tel" id="proj-whatsapp" class="input" value="${project.whatsapp || ''}" placeholder="+52 123 456 7890" required />
                  </div>
                </div>

                <div class="form-group" style="display:flex; flex-direction:column; gap:6px;">
                  <label class="input-label" style="font-weight: 600; font-size: 13px;">Servicios a agendar (Nombre - Duración - Precio)</label>
                  <textarea id="proj-services" class="input" rows="4" style="resize: vertical; font-family: monospace; font-size: 13px; line-height: 1.6; padding: 14px 18px;" placeholder="Ej.&#10;Corte Clásico - 30 min - $15&#10;Tratamiento Capilar - 45 min - $30" required>${project.services || ''}</textarea>
                </div>

                <div class="form-group" style="display:flex; flex-direction:column; gap:6px;">
                  <label class="input-label" style="font-weight: 600; font-size: 13px;">Colores preferidos o comentarios de diseño</label>
                  <textarea id="proj-notes" class="input" rows="3" style="resize: vertical; padding: 14px 18px;" placeholder="Ej. Prefiero tonos azules oscuros con blanco.">${project.notes || ''}</textarea>
                </div>

                <div style="display:flex; justify-content:space-between; align-items:center; margin-top: 12px; padding-top: 20px; border-top:1px solid var(--color-border); flex-wrap:wrap; gap:16px;">
                  <div style="display:flex; align-items:center; gap:8px;">
                    <span style="font-size:13px; color:var(--color-ink-muted);">Estado del sitio:</span>
                    <span class="status-${project.status.toLowerCase().replace(' ', '-')}" style="font-size: 12px; font-weight: 700; padding: 4px 10px; border-radius: 100px; text-transform: uppercase;">
                      ${project.status}
                    </span>
                  </div>

                  <div class="step-actions" style="margin: 0;">
                    <button type="submit" class="btn btn-primary btn-lg" style="box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);">
                      Guardar y Solicitar Cambios
                    </button>
                  </div>
                </div>
              </form>
            </div>

            <!-- Project Roadmap Timeline Card -->
            <div style="border: 1px solid var(--color-border); box-shadow: 0 4px 20px rgba(0,0,0,0.02); background: white; border-radius: 16px; padding: 32px; text-align: left;">
              <h3 style="font-size: 16px; font-weight: 700; color: var(--color-ink); margin-bottom: 6px;">Roadmap del Proyecto</h3>
              <p style="font-size: 13px; color: var(--color-ink-muted); margin-bottom: 24px;">Progreso de diseño y puesta en marcha de tu motor de reservas.</p>
              
              <div class="timeline" style="margin: 0; padding: 0;">
                <div class="timeline-item done">
                  <div class="timeline-dot"></div>
                  <div class="timeline-content">
                    <strong>Ficha técnica recibida</strong>
                    <span>Tus datos iniciales han sido registrados</span>
                  </div>
                </div>
                <div class="timeline-item ${['En Diseño', 'En Desarrollo', 'Completado'].includes(project.status) ? 'done' : ''}">
                  <div class="timeline-dot" ${project.status === 'En Diseño' ? 'style="background: var(--color-accent); border-color: var(--color-accent);"' : ''}></div>
                  <div class="timeline-content">
                    <strong ${project.status === 'En Diseño' ? 'style="color: var(--color-accent);"' : ''}>Diseño de interfaz</strong>
                    <span>Maquetado de estilo y paleta de colores</span>
                  </div>
                </div>
                <div class="timeline-item ${['En Desarrollo', 'Completado'].includes(project.status) ? 'done' : ''}">
                  <div class="timeline-dot" ${project.status === 'En Desarrollo' ? 'style="background: var(--color-accent); border-color: var(--color-accent);"' : ''}></div>
                  <div class="timeline-content">
                    <strong ${project.status === 'En Desarrollo' ? 'style="color: var(--color-accent);"' : ''}>Desarrollo y motor de reservas</strong>
                    <span>Montaje del calendario y pasarela de pago</span>
                  </div>
                </div>
                <div class="timeline-item ${project.status === 'Completado' ? 'done' : ''}">
                  <div class="timeline-dot" ${project.status === 'Completado' ? 'style="background: var(--color-success); border-color: var(--color-success);"' : ''}></div>
                  <div class="timeline-content">
                    <strong ${project.status === 'Completado' ? 'style="color: var(--color-success);"' : ''}>Despliegue final y puesta en marcha</strong>
                    <span>Dominio activo y listo para recibir clientes</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column: Billing Status & CRM Chat -->
          <div style="display: flex; flex-direction: column; gap: 24px;">
            
            <!-- Subscription / Payment Info Card -->
            <div style="background: white; border: 1px solid var(--color-border); border-radius: 16px; padding: 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.02);">
              <h3 style="font-size: 15px; font-weight: 700; color: var(--color-ink); margin-bottom: 14px; display: flex; align-items: center; gap: 8px;">
                💳 Historial de Pagos & Plan
              </h3>
              
              <div style="display: flex; justify-content: space-between; align-items: center; background: var(--color-surface-0); padding: 12px 16px; border-radius: 8px; margin-bottom: 12px;">
                <div>
                  <span style="font-size: 12px; color: var(--color-ink-muted); display: block; text-transform: uppercase; font-weight: 600; letter-spacing: 0.5px;">Plan Contratado</span>
                  <strong style="font-size: 14px; color: var(--color-ink);">${isDedicado ? 'Plan Dedicado' : 'Plan Base'}</strong>
                </div>
                <span style="font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 100px; background: #ecfdf5; color: #10b981; text-transform: uppercase;">
                  Activo
                </span>
              </div>

              <div style="font-size: 13px; color: var(--color-ink-secondary); line-height: 1.5;">
                <div style="display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px dashed var(--color-border);">
                  <span>Monto recurrente:</span>
                  <strong>$${isDedicado ? '99' : '30'} USD/mes</strong>
                </div>
                <div style="display: flex; justify-content: space-between; padding: 6px 0;">
                  <span>Último pago:</span>
                  <span style="color: var(--color-success); font-weight: 600;">$${isDedicado ? '99.00' : '30.00'} USD (Completado)</span>
                </div>
              </div>
            </div>

            <!-- Client CRM Chat Panel -->
            <div style="background: white; border: 1px solid var(--color-border); border-radius: 16px; display: flex; flex-direction: column; overflow: hidden; height: 500px; box-shadow: 0 4px 20px rgba(0,0,0,0.02);">
              <div style="padding: 14px 20px; border-bottom: 1px solid var(--color-border); font-size: 12px; font-weight: 700; color: var(--color-ink-secondary); display: flex; justify-content: space-between; align-items: center; background: white;">
                <span>CHAT DE SOPORTE & CAMBIOS</span>
                <span style="background: #e0f2fe; color: #0284c7; font-size: 10px; padding: 2px 8px; border-radius: 100px;">Soporte chamba</span>
              </div>

              <!-- Message History -->
              <div id="client-chat-container" style="flex-grow: 1; padding: 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 16px; background: #f8fafc;">
                ${project.chatHistory.map((msg: any) => `
                  <div style="max-width: 80%; align-self: ${msg.sender === 'client' ? 'flex-end' : 'flex-start'};">
                    <div style="background: ${msg.sender === 'client' ? 'var(--color-accent)' : 'white'}; color: ${msg.sender === 'client' ? 'white' : 'var(--color-ink)'}; padding: 10px 14px; border-radius: ${msg.sender === 'client' ? '12px 12px 0 12px' : '12px 12px 12px 0'}; font-size: 13px; border: 1px solid ${msg.sender === 'client' ? 'transparent' : 'var(--color-border)'}; box-shadow: 0 1px 3px rgba(0,0,0,0.02); line-height: 1.5;">
                      ${msg.message}
                    </div>
                    <div style="text-align: ${msg.sender === 'client' ? 'right' : 'left'}; font-size: 10px; color: var(--color-ink-muted); margin-top: 4px; padding: 0 4px;">
                      ${msg.time}
                    </div>
                  </div>
                `).join('')}
              </div>

              <!-- Chat Input -->
              <form id="client-chat-form" style="padding: 16px; border-top: 1px solid var(--color-border); background: white; display: flex; gap: 10px;">
                <input type="text" id="client-message-input" class="input" style="height: 42px; font-size: 13px; border-radius: 6px;" placeholder="Describe los cambios solicitados..." required />
                <button type="submit" class="btn btn-primary" style="padding: 0 20px; font-size: 13px; height: 42px; min-height: auto; border-radius: 6px; box-shadow: none;">Enviar</button>
              </form>
            </div>

          </div>

        </div>
      </div>
    </section>
  `

  // Scroll chat to bottom
  const chatContainer = container.querySelector('#client-chat-container') as HTMLDivElement
  if (chatContainer) chatContainer.scrollTop = chatContainer.scrollHeight

  // Handle project form submission
  const form = container.querySelector('#project-form') as HTMLFormElement
  form.addEventListener('submit', async (e) => {
    e.preventDefault()

    const businessName = (container.querySelector('#proj-business') as HTMLInputElement).value
    const niche = (container.querySelector('#proj-niche') as HTMLSelectElement).value
    const webType = (container.querySelector('#proj-webtype') as HTMLSelectElement).value
    const whatsapp = (container.querySelector('#proj-whatsapp') as HTMLInputElement).value
    const services = (container.querySelector('#proj-services') as HTMLTextAreaElement).value
    const notes = (container.querySelector('#proj-notes') as HTMLTextAreaElement).value

    try {
      const saveResponse = await fetch('/api/projects/my', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-email': loggedInUser
        },
        body: JSON.stringify({ businessName, niche, webType, services, whatsapp, notes })
      })

      if (!saveResponse.ok) {
        throw new Error('Fallo al guardar')
      }

      alert('¡Configuración guardada con éxito en MongoDB! El administrador ha recibido tu solicitud.')
    } catch (err) {
      console.error(err)
      alert('Error al guardar los datos del proyecto en el servidor.')
    }
  })

  // Handle client chat submission
  const chatForm = container.querySelector('#client-chat-form') as HTMLFormElement
  chatForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    const input = container.querySelector('#client-message-input') as HTMLInputElement
    const text = input.value.trim()
    if (!text) return

    try {
      const response = await fetch(`/api/projects/${project._id || project.id}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sender: 'client', message: text })
      })

      if (!response.ok) {
        throw new Error('Error al enviar mensaje')
      }

      const updatedProj = await response.json()
      
      // Update UI chat messages area
      const chatMessagesContainer = container.querySelector('#client-chat-container') as HTMLDivElement
      if (chatMessagesContainer) {
        chatMessagesContainer.innerHTML = updatedProj.chatHistory.map((msg: any) => `
          <div style="max-width: 80%; align-self: ${msg.sender === 'client' ? 'flex-end' : 'flex-start'};">
            <div style="background: ${msg.sender === 'client' ? 'var(--color-accent)' : 'white'}; color: ${msg.sender === 'client' ? 'white' : 'var(--color-ink)'}; padding: 10px 14px; border-radius: ${msg.sender === 'client' ? '12px 12px 0 12px' : '12px 12px 12px 0'}; font-size: 13px; border: 1px solid ${msg.sender === 'client' ? 'transparent' : 'var(--color-border)'}; box-shadow: 0 1px 3px rgba(0,0,0,0.02); line-height: 1.5;">
              ${msg.message}
            </div>
            <div style="text-align: ${msg.sender === 'client' ? 'right' : 'left'}; font-size: 10px; color: var(--color-ink-muted); margin-top: 4px; padding: 0 4px;">
              ${msg.time}
            </div>
          </div>
        `).join('')
        
        chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight
      }
      
      input.value = ''
    } catch (err) {
      console.error(err)
      alert('Error de red al enviar el mensaje.')
    }
  })

  // Logout button handler
  const logoutBtn = container.querySelector('#logout-btn') as HTMLButtonElement
  logoutBtn.addEventListener('click', (e) => {
    e.preventDefault()
    localStorage.removeItem('logged_in_user')
    window.location.hash = '#/'
  })
}
