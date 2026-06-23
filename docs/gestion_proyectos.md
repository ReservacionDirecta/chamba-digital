# Ecosistema de Gestión de Proyectos, Kanban y CRM

Este documento detalla el flujo de registro, configuración de proyectos, administración y comunicación (CRM) de **chamba.digital**.

---

## 1. Flujo de Suscripción y Registro

El proceso de onboarding del cliente consta de los siguientes pasos:

1. **Selección del Plan:** El cliente selecciona entre el Plan Base ($30/mes) o Plan Dedicado ($99/mes + 6%) en `#/suscripcion`.
2. **Formulario de Registro Básico:** El cliente ingresa sus datos básicos (nombre, correo, nombre del negocio, teléfono).
3. **Activación de Suscripción:** Tras la activación (simulada o a través de Polar.sh), el cliente es redirigido a la pantalla de éxito.
4. **Configuración del Proyecto:** En lugar de volver al inicio, el cliente es guiado al panel de configuración de su proyecto (`#/mi-proyecto`).

---

## 2. Panel de Configuración de Proyecto (Cliente)

En esta sección (`#/mi-proyecto`), el cliente define la identidad de su nuevo sitio web y motor de reservas:

* **Detalles del Negocio:** Nombre comercial y nicho (barbería, consultorio, spa, etc.).
* **Tipo de Web:** Estilo y preferencias de diseño (Minimalista, Moderna, etc.).
* **Servicios Ofrecidos:** Nombre, duración y precio de los servicios principales a configurar.
* **Notas Adicionales:** Requisitos especiales y número de contacto de WhatsApp.

*Nota: Estos datos se persisten localmente en `localStorage` de forma reactiva y dinámica para simular la base de datos.*

---

## 3. Panel de Administrador (Kanban & CRM)

En el panel de administración (`#/admin`), el administrador tiene acceso a las siguientes herramientas de gestión en paralelo:

### A. Tablero Kanban de Proyectos
Permite clasificar las peticiones activas de los clientes en cuatro columnas de estado:
1. **Recibido:** Proyectos recién registrados que requieren revisión técnica.
2. **En Diseño:** Sitios web en proceso de diseño de interfaz (UI/UX).
3. **En Desarrollo:** Páginas en proceso de codificación e integración del motor de reservas.
4. **Completado:** Proyectos desplegados en producción y activos para recibir citas.

*El administrador puede avanzar o retroceder el estado del proyecto directamente desde las tarjetas o el modal de detalles.*

### B. Filtros de Búsqueda
Permite segmentar rápidamente la lista de solicitudes por:
* **Nicho / Industria** (ej. Peluquería, Consultorio, Spa).
* **Plan Suscrito** (Plan Base o Plan Dedicado).

### C. Ficha de Detalle y CRM Chat
Al hacer clic en una solicitud del Kanban, se abre una vista detallada que contiene:
* **Ficha Técnica:** Resumen completo del proyecto enviado por el cliente.
* **Historial e Interacción en Chat (CRM):** Una sección de chat simulado que muestra la interacción con el cliente y permite enviar mensajes de soporte directo, facilitando la comunicación constante.
