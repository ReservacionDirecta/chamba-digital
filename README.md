# chamba.digital 2.0

> Ecosistema de Suscripción WaaS Universal para Modelos basados en Citas, Reservas Automáticas y Monetización Directa.

**Web con Motor de Reservas + WhatsApp + Polar.sh** — Por solo $30/mes.

---

## Visión

chamba.digital 2.0 redefina el concepto de infraestructura web para el sector de servicios. Si un negocio depende de agendar citas o reservar franjas horarias para facturar, es nuestro cliente ideal.

Reemplazamos el modelo arcaico de desarrollo estático por un ecosistema **WaaS (Web as a Service)** por suscripción recurrente.

## Sectores de Aplicación

- **Estética y Salud:** Peluquerías, Spas, Consultorios, Veterinarias
- **Profesionales:** Inmobiliarias & Realtors, Arquitectos, Diseñadores, Fotógrafos
- **Educación y Capacitación:** Academias, Gimnasios, Talleres, Clases Particulares

---

## Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | Vite + TypeScript vanilla |
| CSS | Tailwind CSS v4 + Custom Design System |
| Backend | Express.js + TypeScript |
| Base de datos | MongoDB + Mongoose |
| Pagos | Polar.sh (checkout server-side) |
| Emails | Nodemailer (HTML templates) |
| Animaciones | IntersectionObserver + requestAnimationFrame |
| Scroll Video | Custom scroll-linked video engine |

---

## Estructura del Proyecto

```
polar-booking-sites/
├── index.html                    # Entry point + SEO + JSON-LD
├── vite.config.ts                # Vite + Tailwind plugin
├── tsconfig.json
├── package.json
├── .env                          # Variables de entorno
│
├── public/
│   ├── favicon.svg               # Logo SVG
│   ├── og-image.svg              # Open Graph image
│   ├── robots.txt                # SEO
│   ├── sitemap.xml               # SEO
│   ├── hero.mp4                  # Video horizontal (desktop)
│   ├── hero-vertical.mp4         # Video vertical (mobile)
│   ├── images/                   # Ilustraciones SVG
│   └── icons/                    # 22 iconos SVG custom
│
├── src/
│   ├── main.ts                   # Router + init
│   ├── style.css                 # Design system completo
│   │
│   ├── lib/
│   │   ├── api.ts                # Client API fetch
│   │   ├── animations.ts         # Scroll reveal engine
│   │   ├── interactions.ts       # Magnetic, tilt, ripple, parallax
│   │   ├── seo.ts                # Dynamic meta tags por página
│   │   └── video-scroll.ts       # Scroll-linked video controller
│   │
│   └── pages/
│       ├── home.ts               # Landing + hero video + pricing
│       ├── booking.ts            # Wizard 4 pasos
│       ├── payment-pending.ts    # Instrucciones de pago + polling
│       ├── payment-success.ts    # Confirmación + timeline
│       ├── subscription.ts       # Registro + Polar checkout
│       ├── subscription-success.ts # Bienvenida post-pago
│       └── admin.ts              # Panel de administración
│
└── server/
    ├── index.ts                  # Express entry
    ├── db.ts                     # MongoDB connection
    ├── models/
    │   ├── Service.ts
    │   ├── Booking.ts            # + paymentStatus, paymentMethod
    │   └── Subscription.ts       # + commissionRate
    ├── routes/
    │   ├── services.ts           # CRUD servicios
    │   ├── bookings.ts           # CRUD reservas + email
    │   ├── checkout.ts           # Polar checkout sessions
    │   └── webhook.ts            # Polar + WhatsApp + Email confirm
    └── services/
        └── email.ts              # 3 templates HTML (booking, payment, welcome)
```

---

## Instalación

```bash
git clone https://github.com/ReservacionDirecta/chamba-digital.git
cd chamba-digital
pnpm install
```

## Configuración

Copia `.env.example` a `.env` y configura:

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/polar-booking

# Polar.sh
POLAR_ACCESS_TOKEN=tu_token_de_polar
POLAR_WEBHOOK_SECRET=tu_secreto_webhook
POLAR_PRODUCT_BASE=tu_product_id_base
POLAR_PRODUCT_DEDICADO=tu_product_id_dedicado

# Email (SMTP)
SMTP_HOST=smtp.ethereal.email
SMTP_PORT=587
SMTP_USER=tu_usuario
SMTP_PASS=tu_password

# Server
PORT=3001
VITE_API_URL=http://localhost:3001/api
```

## Ejecución

```bash
pnpm dev
```

Esto arranca:
- **Frontend:** http://localhost:5173 (Vite)
- **Backend:** http://localhost:3001 (Express)

---

## Modelo de Negocio

### Plan Base — $30 USD/mes
- Web optimizada de alta conversión (1-3 secciones)
- Motor de reservas automatizado
- Pagos con Polar.sh
- Botón de WhatsApp
- Hosting premium + SSL
- SEO orgánico base
- Cambios ilimitados (regla de oro: 48-72h)

### Plan Dedicado — $99 USD/mes + 6% ventas
- Todo del Plan Base
- Integración con cualquier herramienta
- Automatizaciones con IA
- Embudo de conversión optimizado
- Departamento de sistemas dedicado

### Reglas del Juego

1. **Tu web es un organismo vivo** — se pulsa mes a mes
2. **Nosotros el vehículo, tú la gasolina** — tráfico y atención al cliente
3. **Cambios ilimitados** — consolidados, 48-72h hábiles
4. **Auditoría de comisiones** — mensual, transparente, liquidación día 5

---

## Flujo de Reserva

```
1. Selección de servicio
   └→ Cards con nombre, descripción, duración, precio

2. Fecha y hora
   └→ Date picker + time slots con disponibilidad

3. Datos de contacto
   └→ Nombre, email, teléfono

4. Pago
   ├→ 💳 Tarjeta → Polar.sh checkout (cobro instantáneo)
   ├→ 💬 WhatsApp → mensaje con datos + referencia
   └→ 📧 Email → instrucciones de pago

5. Confirmación
   ├→ Webhook Polar.sh actualiza paymentStatus
   ├→ Email automático con confirmación
   └→ Polling cada 5s para actualización en tiempo real
```

---

## Flujo de Suscripción

```
1. Selección de plan (Base $30 / Dedicado $99+6%)
2. Formulario mínimo: nombre, email, negocio, teléfono
3. Redirect a Polar.sh checkout
4. Cobro instantáneo con tarjeta
5. Webhook confirma → email de bienvenida
```

---

## Email Transaccional

| Template | Trigger | Contenido |
|----------|---------|-----------|
| Booking Confirmation | POST /api/bookings | Detalles + instrucciones de pago + link al checkout |
| Payment Confirmed | Webhook checkout.updated | Detalles de reserva + confirmación |
| Subscription Welcome | Webhook checkout.updated | Bienvenida + próximos pasos |

Templates HTML con branding chamba.digital, inline CSS, responsive.

---

## SEO

- **Meta tags** por página (title, description, keywords)
- **Open Graph** + **Twitter Cards**
- **JSON-LD** (SoftwareApplication, FAQPage, WebSite, Product)
- **robots.txt** + **sitemap.xml**
- **Dynamic SEO** manager por ruta

---

## UI/UX Premium

### Design System "Kinetic Precision"
- **Tema:** Claro (#ffffff base)
- **Acento:** Electric Blue (#3b82f6)
- **Fuente:** Inter (weights 400-800)
- **Bordes:** Sutiles `rgba(0,0,0,0.06)`

### Animaciones
- **Scroll reveal:** IntersectionObserver + fade-up/fade-left/scale-in
- **Magnetic buttons:** `data-magnetic` — botón sigue el cursor
- **Tilt cards:** `data-tilt` — perspectiva 3D al hover
- **Ripple:** `data-ripple` — onda de clicked
- **Stagger:** Delay progresivo en grids

### Hero Video
- **Desktop:** `hero.mp4` (horizontal)
- **Mobile:** `hero-vertical.mp4` (vertical)
- **Scroll-linked:** video.currentTime = scrollProgress × duration
- **Overlay:** se desvanece al 90% del scroll
- **Audio toggle:** botón glassmorphism para activar/desactivar sonido
- **Autoplay:** muted + loop, se activa con scroll

### 22 Iconos SVG Custom
- Peluquería, Consultorio, Spa, Gimnasio, Inmobiliaria
- Taller, Clases, Fotografía, Veterinaria, Arquitectos
- Calendar, Card, Chat, Bolt, Timer, Phone, Hourglass
- Check, Party, Settings, Responsive, Rocket, Email

---

## API Endpoints

### Servicios
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /api/services | Listar servicios |
| GET | /api/services/:id | Obtener servicio |
| POST | /api/services | Crear servicio |
| PUT | /api/services/:id | Actualizar servicio |
| DELETE | /api/services/:id | Eliminar servicio |

### Reservas
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /api/bookings | Listar reservas |
| GET | /api/bookings/:id | Obtener reserva |
| POST | /api/bookings | Crear reserva + email |
| PATCH | /api/bookings/:id/status | Actualizar estado |
| PATCH | /api/bookings/:id/confirm-payment | Confirmar pago manual |

### Checkout
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | /api/checkout/session | Crear checkout Polar para reserva |
| POST | /api/checkout/subscription | Crear checkout Polar para suscripción |

### Webhooks
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | /api/webhook/polar | Webhook de Polar.sh |
| POST | /api/webhook/whatsapp-confirm | Confirmación manual vía WhatsApp |
| POST | /api/webhook/email-confirm | Confirmación manual vía Email |

---

## Variables de Entorno

| Variable | Descripción |
|----------|-------------|
| `MONGODB_URI` | URI de conexión a MongoDB |
| `POLAR_ACCESS_TOKEN` | Token de acceso a Polar.sh API |
| `POLAR_WEBHOOK_SECRET` | Secreto para verificar webhooks |
| `POLAR_PRODUCT_BASE` | ID del producto Polar para Plan Base |
| `POLAR_PRODUCT_DEDICADO` | ID del producto Polar para Plan Dedicado |
| `SMTP_HOST` | Host del servidor SMTP |
| `SMTP_PORT` | Puerto SMTP |
| `SMTP_USER` | Usuario SMTP |
| `SMTP_PASS` | Contraseña SMTP |
| `PORT` | Puerto del servidor Express |
| `VITE_API_URL` | URL base de la API para el frontend |

---

## Deploy

### Vercel (Frontend)
```bash
vercel --prod
```

### Render / Railway (Backend)
- Build: `pnpm install && npx tsc`
- Start: `node dist/server/index.js`

### MongoDB Atlas
Usar `MONGODB_URI` con la connection string de Atlas.

---

## Licencia

Proyecto privado — chamba.digital 2026.

---

## Autor

**chamba.digital** — Infraestructura de ventas que crece con tu negocio.
