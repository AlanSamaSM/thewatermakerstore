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
    return json({ ok: false, error: 'Method not allowed.' }, 405);
  }

  if (!env.RESEND_API_KEY || !env.CONTACT_TO_EMAIL || !env.CONTACT_FROM_EMAIL || !env.TURNSTILE_SECRET_KEY) {
    return json({ ok: false, error: 'The form is temporarily unavailable.' }, 500);
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return json({ ok: false, error: 'Invalid request.' }, 400);
  }

  const email = String(payload?.email || '').trim().toLowerCase();
  const phone = String(payload?.phone || '').trim();
  const message = String(payload?.message || '').trim();
  const turnstileToken = String(payload?.turnstileToken || '').trim();
  const validationError = validatePayload({ email, phone, message, turnstileToken });

  if (validationError) {
    return json({ ok: false, error: validationError }, 400);
  }

  const turnstileOk = await verifyTurnstile({
    secret: env.TURNSTILE_SECRET_KEY,
    token: turnstileToken,
    ip: request.headers.get('CF-Connecting-IP')
  });

  if (!turnstileOk) {
    return json({ ok: false, error: 'We could not verify the form. Please try again.' }, 400);
  }

  const sent = await sendLeadEmail({
    apiKey: env.RESEND_API_KEY,
    from: env.CONTACT_FROM_EMAIL,
    to: env.CONTACT_TO_EMAIL,
    replyTo: email,
    email,
    phone,
    message
  });

  if (!sent) {
    return json({ ok: false, error: 'We could not send your message. Try WhatsApp.' }, 502);
  }

  return json({ ok: true });
}

function validatePayload({ email, phone, message, turnstileToken }) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email) || email.length > 254) return 'Enter a valid email.';
  if (phone.length > 40) return 'The phone number is too long.';
  if (message.length < 10) return 'Tell us a little more so we can guide you well.';
  if (message.length > 1500) return 'The message is too long.';
  if (!turnstileToken) return 'Complete the verification to send the message.';
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

async function sendLeadEmail({ apiKey, from, to, replyTo, email, phone, message }) {
  const submittedAt = new Date().toISOString();
  const text = [
    'WEBSITE CLIENT ALERT',
    '',
    `Email: ${email}`,
    phone ? `Phone: ${phone}` : '',
    `Submitted at: ${submittedAt}`,
    '',
    'Message:',
    message
  ].filter(Boolean).join('\n');

  const phoneHtml = phone
    ? `<p style="margin:0 0 10px"><strong style="color:#0A4A6E">Phone:</strong> ${escapeHtml(phone)}</p>`
    : '';

  const html = `
    <div style="margin:0;padding:0;background:#F4F7F8;font-family:Arial,sans-serif;color:#111827">
      <div style="max-width:640px;margin:0 auto;padding:28px 16px">
        <div style="background:#0A4A6E;color:#ffffff;border-radius:12px 12px 0 0;padding:22px 24px">
          <p style="margin:0 0 6px;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#BFE6F8">The Watermaker Store</p>
          <h1 style="font-size:24px;line-height:1.2;margin:0">WEBSITE CLIENT ALERT</h1>
        </div>
        <div style="background:#ffffff;border:1px solid #DDE7EA;border-top:0;border-radius:0 0 12px 12px;padding:24px">
          <p style="margin:0 0 10px"><strong style="color:#0A4A6E">Email:</strong> ${escapeHtml(email)}</p>
          ${phoneHtml}
          <p style="margin:0 0 18px"><strong style="color:#0A4A6E">Submitted at:</strong> ${escapeHtml(submittedAt)}</p>
          <p style="margin:0 0 8px"><strong style="color:#0A4A6E">Message:</strong></p>
          <div style="white-space:pre-wrap;line-height:1.6;background:#F4F7F8;border:1px solid #DDE7EA;border-radius:8px;padding:16px">${escapeHtml(message)}</div>
        </div>
      </div>
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
        subject: 'WEBSITE CLIENT ALERT',
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
