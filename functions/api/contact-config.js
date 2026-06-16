const jsonHeaders = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store'
};

export async function onRequestGet({ env }) {
  return Response.json(
    { ok: Boolean(env.TURNSTILE_SITE_KEY), siteKey: env.TURNSTILE_SITE_KEY || '' },
    { headers: jsonHeaders }
  );
}

