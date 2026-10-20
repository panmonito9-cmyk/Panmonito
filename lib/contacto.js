import nodemailer from 'nodemailer';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const BUSINESS = 'Panmonito';
const emailPattern = /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+$/i;
const recentRequests = new Map();
const WINDOW_MS = 15 * 60 * 1000;

export function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
}

export function renderConfirmation(nombre, template = readFileSync(join(process.cwd(), 'emails/confirmacion.html'), 'utf8')) {
  const values = { nombre, negocio: BUSINESS, anio: new Date().getFullYear() };
  return template.replace(/\{\{(nombre|negocio|anio)\}\}/g, (_, key) => escapeHtml(values[key]));
}

// Dependency injection lets tests verify delivery without sending real emails.
export function createContactHandler({ env = process.env, createTransport = nodemailer.createTransport, now = Date.now, rateLimits = recentRequests, render = renderConfirmation } = {}) {
  return async function handler(req, res) {
    res.setHeader('Cache-Control', 'no-store');
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return res.status(405).json({ error: 'Método no permitido.' });
    }
    const contentType = String(req.headers['content-type'] || '').split(';')[0].trim().toLowerCase();
    if (contentType !== 'application/json') return res.status(415).json({ error: 'Envía el formulario como JSON.' });
    // The browser must send from this website, not another origin.
    try {
      const origin = new URL(req.headers.origin);
      if (origin.host !== req.headers.host) return res.status(403).json({ error: 'Origen no permitido.' });
    } catch {
      return res.status(403).json({ error: 'Origen no permitido.' });
    }
    let body;
    try {
      const raw = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
      if (!raw || Buffer.byteLength(raw) > 12000) return res.status(413).json({ error: 'El mensaje es demasiado largo.' });
      body = JSON.parse(raw);
    } catch {
      return res.status(400).json({ error: 'Formulario no válido.' });
    }
    if (!body || typeof body !== 'object' || Array.isArray(body)) return res.status(400).json({ error: 'Formulario no válido.' });
    if (body.website) return res.status(200).json({ ok: true }); // Honeypot: do not send mail.
    const { nombre, email, mensaje, telefono = '' } = body;
    if (typeof nombre !== 'string' || !nombre.trim() || nombre.trim().length > 80 || /[\r\n\x00-\x1f]/.test(nombre) ||
        typeof email !== 'string' || email.length > 254 || !emailPattern.test(email.trim()) ||
        typeof mensaje !== 'string' || !mensaje.trim() || mensaje.length > 4000 ||
        typeof telefono !== 'string' || telefono.length > 40 || /[\r\n\x00-\x1f]/.test(telefono)) {
      return res.status(400).json({ error: 'Revisa el nombre, el correo y el mensaje (máximo 4000 caracteres).' });
    }
    const currentTime = now();
    if (typeof body.startedAt !== 'number' || currentTime - body.startedAt < 2000 || currentTime - body.startedAt > 24 * 60 * 60 * 1000) {
      return res.status(400).json({ error: 'Espera unos segundos y vuelve a enviar el formulario. Si dejaste la página abierta, recárgala.' });
    }
    const user = env.GMAIL_USER?.trim();
    const pass = env.GMAIL_APP_PASSWORD?.replace(/\s/g, '');
    const recipient = env.CONTACT_EMAIL?.trim();
    if (!user || !emailPattern.test(user) || !pass || !recipient || !emailPattern.test(recipient)) {
      return res.status(503).json({ error: 'El formulario aún no está disponible. Contáctanos por WhatsApp o inténtalo más tarde.' });
    }
    // Basic per-instance protection. See CORREOS.md for serverless limitations.
    for (const [key, entry] of rateLimits) if (entry.reset <= currentTime) rateLimits.delete(key);
    const ip = String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0].trim();
    const keys = ['ip:' + ip, 'email:' + email.trim().toLowerCase()];
    if (keys.some((key) => (rateLimits.get(key)?.count || 0) >= 5)) {
      res.setHeader('Retry-After', '900');
      return res.status(429).json({ error: 'Has enviado varios mensajes. Inténtalo de nuevo en 15 minutos.' });
    }
    for (const key of keys) {
      const entry = rateLimits.get(key) || { count: 0, reset: currentTime + WINDOW_MS };
      entry.count += 1;
      rateLimits.set(key, entry);
    }
    let transport;
    try {
      // Render before delivering so a missing template cannot cause partial delivery.
      const html = render(nombre.trim());
      transport = createTransport({
        host: 'smtp.gmail.com', port: 465, secure: true,
        auth: { user, pass }, connectionTimeout: 10000, greetingTimeout: 10000, socketTimeout: 15000,
      });
      const from = { name: BUSINESS, address: user };
      const notice = await transport.sendMail({
        from, to: recipient, replyTo: { name: nombre.trim(), address: email.trim() },
        subject: `Nueva consulta desde ${BUSINESS}`,
        text: `Nombre: ${nombre.trim()}\nCorreo: ${email.trim()}\nTeléfono: ${telefono.trim() || 'No indicado'}\n\nMensaje:\n${mensaje.trim()}`,
        disableFileAccess: true, disableUrlAccess: true,
      });
      if (!notice.accepted?.length) throw new Error('DELIVERY_REJECTED');
      // Do not ask the visitor to retry if the business already received the message.
      let confirmationSent = false;
      try {
        const confirmation = await transport.sendMail({
          from, to: email.trim(), replyTo: recipient,
          subject: `Gracias por contactar con ${BUSINESS}`,
          html,
          text: `Hola, ${nombre.trim()}:\n\nRecibimos tu mensaje a través de nuestra página web. Lo revisaremos y te responderemos al correo que nos compartiste.\n\nPuedes responder a este correo para completar tu consulta.\n\nGracias por tenernos en cuenta,\nEl equipo de ${BUSINESS}`,
          headers: { 'Auto-Submitted': 'auto-replied', 'X-Auto-Response-Suppress': 'All' },
          disableFileAccess: true, disableUrlAccess: true,
        });
        confirmationSent = Boolean(confirmation.accepted?.length);
      } catch { /* The original inquiry was delivered successfully. */ }
      return res.status(200).json({ ok: true, confirmationSent });
    } catch (error) {
      // Never log passwords, contact data, or raw SMTP responses.
      console.error('contacto_delivery_failed', typeof error?.code === 'string' ? error.code : 'SEND_ERROR');
      return res.status(502).json({ error: 'No pudimos enviar el mensaje. Inténtalo más tarde o contáctanos por WhatsApp.' });
    } finally {
      transport?.close?.();
    }
  };
}
