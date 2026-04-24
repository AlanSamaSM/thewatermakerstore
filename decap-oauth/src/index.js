/**
 * Decap CMS ↔ GitHub OAuth proxy (Cloudflare Worker).
 *
 * Routes:
 *   GET /auth       → redirect to GitHub OAuth authorize
 *   GET /callback   → exchange code for token, postMessage back to opener
 *   GET /           → health check
 */

const GH_AUTHORIZE = "https://github.com/login/oauth/authorize";
const GH_TOKEN = "https://github.com/login/oauth/access_token";
const DEFAULT_SCOPE = "repo,user";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/auth") {
      const scope = url.searchParams.get("scope") || DEFAULT_SCOPE;
      const authorize = new URL(GH_AUTHORIZE);
      authorize.searchParams.set("client_id", env.CLIENT_ID);
      authorize.searchParams.set("scope", scope);
      return Response.redirect(authorize.toString(), 302);
    }

    if (url.pathname === "/callback") {
      const code = url.searchParams.get("code");
      if (!code) {
        return renderResult({ error: "missing_code" });
      }

      const tokenRes = await fetch(GH_TOKEN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "User-Agent": "decap-oauth-worker",
        },
        body: JSON.stringify({
          client_id: env.CLIENT_ID,
          client_secret: env.CLIENT_SECRET,
          code,
        }),
      });

      const data = await tokenRes.json();
      if (!data.access_token) {
        return renderResult({ error: data.error || "token_exchange_failed" });
      }

      return renderResult({ token: data.access_token, provider: "github" });
    }

    return new Response("Decap OAuth proxy online.", {
      headers: { "Content-Type": "text/plain" },
    });
  },
};

function renderResult(payload) {
  const status = payload.error ? "error" : "success";
  const body = JSON.stringify(payload);
  const html = `<!DOCTYPE html>
<html lang="es"><head><meta charset="utf-8"><title>Autenticando…</title>
<style>body{font-family:system-ui,sans-serif;padding:40px;text-align:center;color:#0A4A6E}</style>
</head><body>
<p>Autenticado. Puedes cerrar esta ventana.</p>
<script>
(function () {
  function send() {
    window.opener && window.opener.postMessage(
      'authorization:github:${status}:' + ${JSON.stringify(body)},
      '*'
    );
  }
  window.addEventListener('message', function (e) {
    if (e.data === 'authorizing:github') send();
  }, false);
  window.opener && window.opener.postMessage('authorizing:github', '*');
})();
</script>
</body></html>`;
  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
