const jsonHeaders = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store'
};

const RESEND_API_URL = 'https://api.resend.com/emails';
const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export async function onRequest({ request, env }) {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: jsonHeaders });
  }

  if (request.method !== 'POST') {
    return json({ ok: false, error: 'Metodo no permitido.' }, 405);
  }

  if (!env.RESEND_API_KEY || !env.CONTACT_TO_EMAIL || !env.CONTACT_FROM_EMAIL || !env.TURNSTILE_SECRET_KEY) {
    return json({ ok: false, error: 'Formulario temporalmente no disponible.' }, 500);
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return json({ ok: false, error: 'Solicitud invalida.' }, 400);
  }

  const email = String(payload?.email || '').trim().toLowerCase();
  const message = String(payload?.message || '').trim();
  const turnstileToken = String(payload?.turnstileToken || '').trim();
  const validationError = validatePayload({ email, message, turnstileToken });

  if (validationError) {
    return json({ ok: false, error: validationError }, 400);
  }

  const turnstileOk = await verifyTurnstile({
    secret: env.TURNSTILE_SECRET_KEY,
    token: turnstileToken,
    ip: request.headers.get('CF-Connecting-IP')
  });

  if (!turnstileOk) {
    return json({ ok: false, error: 'No pudimos verificar el formulario. Intenta nuevamente.' }, 400);
  }

  const sent = await sendLeadEmail({
    apiKey: env.RESEND_API_KEY,
    from: env.CONTACT_FROM_EMAIL,
    to: env.CONTACT_TO_EMAIL,
    replyTo: email,
    email,
    message
  });

  if (!sent) {
    return json({ ok: false, error: 'No pudimos enviar tu mensaje. Intenta por WhatsApp.' }, 502);
  }

  return json({ ok: true });
}

function validatePayload({ email, message, turnstileToken }) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email) || email.length > 254) return 'Escribe un correo valido.';
  if (message.length < 10) return 'Cuentanos un poco mas para poder orientarte bien.';
  if (message.length > 1500) return 'El mensaje es muy largo.';
  if (!turnstileToken) return 'Completa la verificacion para enviar el mensaje.';
  return '';
}

async function verifyTurnstile({ secret, token, ip }) {
  const formData = new FormData();
  formData.append('secret', secret);
  formData.append('response', token);
  if (ip) formData.append('remoteip', ip);

  try {
    const response = await fetch(TURNSTILE_VERIFY_URL, {
      method: 'POST',
      body: formData
    });
    const result = await response.json();
    return Boolean(result.success);
  } catch {
    return false;
  }
}

async function sendLeadEmail({ apiKey, from, to, replyTo, email, message }) {
  const submittedAt = new Date().toISOString();
  const text = [
    'Nuevo contacto desde The Watermaker Store',
    '',
    `Correo: ${email}`,
    `Fecha: ${submittedAt}`,
    '',
    'Mensaje:',
    message
  ].join('\n');

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.55;color:#111827">
      <h1 style="font-size:20px;margin:0 0 16px">Nuevo contacto desde The Watermaker Store</h1>
      <p><strong>Correo:</strong> ${escapeHtml(email)}</p>
      <p><strong>Fecha:</strong> ${escapeHtml(submittedAt)}</p>
      <p><strong>Mensaje:</strong></p>
      <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
    </div>
  `;

  try {
    const response = await fetch(RESEND_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: replyTo,
        subject: 'Nuevo contacto - The Watermaker Store',
        text,
        html
      })
    });

    return response.ok;
  } catch {
    return false;
  }
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function json(body, status = 200) {
  return Response.json(body, { status, headers: jsonHeaders });
}

