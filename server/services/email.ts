import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ethereal.email',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
})

interface BookingEmailData {
  to: string
  clientName: string
  serviceName: string
  date: string
  time: string
  amount: number
  bookingId: string
  paymentMethod?: string
}

export async function sendBookingConfirmation(data: BookingEmailData) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', system-ui, sans-serif; background: #f5f3f8; margin: 0; padding: 40px 20px; }
        .container { max-width: 520px; margin: 0 auto; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,.06); }
        .header { background: linear-gradient(135deg, #7c5cfc, #a78bfa); padding: 36px 32px; text-align: center; }
        .header h1 { color: #fff; font-size: 22px; margin: 0 0 6px; font-weight: 700; }
        .header p { color: rgba(255,255,255,.8); font-size: 14px; margin: 0; }
        .body { padding: 32px; }
        .detail-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #f0eef3; font-size: 14px; }
        .detail-row:last-child { border-bottom: none; }
        .detail-label { color: #9b96a8; }
        .detail-value { font-weight: 600; color: #18171d; }
        .amount { font-size: 28px; font-weight: 800; color: #7c5cfc; text-align: center; margin: 24px 0; letter-spacing: -1px; }
        .payment-box { background: #f5f3f8; border-radius: 12px; padding: 20px; margin: 20px 0; }
        .payment-box h3 { font-size: 14px; font-weight: 700; margin: 0 0 12px; color: #18171d; }
        .payment-box ul { margin: 0; padding: 0 0 0 16px; font-size: 13px; color: #6e6a7b; line-height: 1.8; }
        .btn { display: inline-block; background: #7c5cfc; color: #fff !important; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-weight: 600; font-size: 15px; margin: 8px 0; }
        .footer { text-align: center; padding: 24px 32px; font-size: 12px; color: #9b96a8; border-top: 1px solid #f0eef3; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>chamba.digital</h1>
          <p>Reserva confirmada</p>
        </div>
        <div class="body">
          <p style="font-size:15px;color:#6e6a7b;margin:0 0 20px;">Hola <strong>${data.clientName}</strong>, tu reserva ha sido registrada. Para confirmarla, completa el pago.</p>
          <div class="detail-row"><span class="detail-label">Servicio</span><span class="detail-value">${data.serviceName}</span></div>
          <div class="detail-row"><span class="detail-label">Fecha</span><span class="detail-value">${data.date}</span></div>
          <div class="detail-row"><span class="detail-label">Hora</span><span class="detail-value">${data.time}</span></div>
          <div class="detail-row"><span class="detail-label">Referencia</span><span class="detail-value">#${data.bookingId.slice(-8).toUpperCase()}</span></div>
          <div class="amount">$${data.amount} USD</div>
          <div class="payment-box">
            <h3>Instrucciones de pago</h3>
            <ul>
              <li>Opción 1: Paga en línea con tu tarjeta en el enlace de abajo</li>
              <li>Opción 2: Transferencia bancaria a la cuenta que te enviamos</li>
              <li>Opción 3: Confirma por WhatsApp con tu nombre y referencia</li>
            </ul>
          </div>
          <div style="text-align:center;">
            <a href="http://localhost:5173/#/pago/${data.bookingId}" class="btn">Pagar ahora</a>
          </div>
          <p style="font-size:13px;color:#9b96a8;text-align:center;margin:20px 0 0;">Una vez recibido el pago, recibirás un email de confirmación con todos los detalles.</p>
        </div>
        <div class="footer">chamba.digital — Infraestructura de ventas que crece con tu negocio.</div>
      </div>
    </body>
    </html>
  `

  return transporter.sendMail({
    from: '"chamba.digital" <noreply@chamba.digital>',
    to: data.to,
    subject: `Reserva #${data.bookingId.slice(-8).toUpperCase()} — Confirma tu pago`,
    html,
  })
}

export async function sendPaymentConfirmed(data: BookingEmailData) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', system-ui, sans-serif; background: #f5f3f8; margin: 0; padding: 40px 20px; }
        .container { max-width: 520px; margin: 0 auto; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,.06); }
        .header { background: linear-gradient(135deg, #059669, #34d399); padding: 36px 32px; text-align: center; }
        .header h1 { color: #fff; font-size: 22px; margin: 0 0 6px; font-weight: 700; }
        .header p { color: rgba(255,255,255,.8); font-size: 14px; margin: 0; }
        .body { padding: 32px; }
        .check { font-size: 56px; text-align: center; margin: 16px 0; }
        .detail-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #f0eef3; font-size: 14px; }
        .detail-row:last-child { border-bottom: none; }
        .detail-label { color: #9b96a8; }
        .detail-value { font-weight: 600; color: #18171d; }
        .footer { text-align: center; padding: 24px 32px; font-size: 12px; color: #9b96a8; border-top: 1px solid #f0eef3; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>chamba.digital</h1>
          <p>Pago confirmado</p>
        </div>
        <div class="body">
          <div class="check">✅</div>
          <p style="font-size:15px;color:#6e6a7b;margin:0 0 20px;text-align:center;">Tu pago ha sido procesado exitosamente, <strong>${data.clientName}</strong>.</p>
          <div class="detail-row"><span class="detail-label">Servicio</span><span class="detail-value">${data.serviceName}</span></div>
          <div class="detail-row"><span class="detail-label">Fecha</span><span class="detail-value">${data.date}</span></div>
          <div class="detail-row"><span class="detail-label">Hora</span><span class="detail-value">${data.time}</span></div>
          <div class="detail-row"><span class="detail-label">Monto pagado</span><span class="detail-value" style="color:#059669;">$${data.amount} USD</span></div>
          <div class="detail-row"><span class="detail-label">Referencia</span><span class="detail-value">#${data.bookingId.slice(-8).toUpperCase()}</span></div>
          <p style="font-size:14px;color:#6e6a7b;margin:24px 0 0;text-align:center;">Te esperamos el <strong>${data.date} a las ${data.time}</strong>. Si necesitas reagendar, contáctanos por WhatsApp.</p>
        </div>
        <div class="footer">chamba.digital — Infraestructura de ventas que crece con tu negocio.</div>
      </div>
    </body>
    </html>
  `

  return transporter.sendMail({
    from: '"chamba.digital" <noreply@chamba.digital>',
    to: data.to,
    subject: `✅ Pago confirmado — Reserva #${data.bookingId.slice(-8).toUpperCase()}`,
    html,
  })
}

export async function sendSubscriptionWelcome(data: {
  to: string
  name: string
  businessName: string
  plan: string
}) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', system-ui, sans-serif; background: #f5f3f8; margin: 0; padding: 40px 20px; }
        .container { max-width: 520px; margin: 0 auto; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,.06); }
        .header { background: linear-gradient(135deg, #7c5cfc, #a78bfa); padding: 36px 32px; text-align: center; }
        .header h1 { color: #fff; font-size: 22px; margin: 0 0 6px; font-weight: 700; }
        .header p { color: rgba(255,255,255,.8); font-size: 14px; margin: 0; }
        .body { padding: 32px; }
        .footer { text-align: center; padding: 24px 32px; font-size: 12px; color: #9b96a8; border-top: 1px solid #f0eef3; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>chamba.digital</h1>
          <p>Bienvenido a bordo</p>
        </div>
        <div class="body">
          <p style="font-size:15px;color:#6e6a7b;margin:0 0 20px;">Hola <strong>${data.name}</strong>, tu suscripción al <strong>${data.plan}</strong> está activa.</p>
          <p style="font-size:14px;color:#6e6a7b;margin:0 0 16px;">Tu web para <strong>${data.businessName}</strong> está siendo configurada. Te contactaremos en las próximas 24-48 horas con los siguientes pasos.</p>
          <p style="font-size:14px;color:#6e6a7b;margin:0;">Mientras tanto, si tienes preguntas, escríbenos por WhatsApp.</p>
        </div>
        <div class="footer">chamba.digital — Infraestructura de ventas que crece con tu negocio.</div>
      </div>
    </body>
    </html>
  `

  return transporter.sendMail({
    from: '"chamba.digital" <noreply@chamba.digital>',
    to: data.to,
    subject: `Bienvenido a chamba.digital — Suscripción activa`,
    html,
  })
}
