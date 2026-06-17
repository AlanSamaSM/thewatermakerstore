# Contact Email Setup

This project already has the frontend form and the Cloudflare Pages Functions needed to receive contact messages. To make the messages arrive in your inbox, configure Resend and Turnstile, then add the environment variables in Cloudflare Pages.

## 1. Prepare Resend

1. Create a Resend account.
2. Verify a sending domain in Resend, for example `mail.thewatermakerstore.com.mx` or another domain you control.
3. Create an API key.
4. Decide:
   - `CONTACT_TO_EMAIL`: the inbox that should receive messages.
   - `CONTACT_FROM_EMAIL`: a verified sender on your Resend domain.

Example:

```txt
CONTACT_TO_EMAIL=alan@tu-dominio.com
CONTACT_FROM_EMAIL=The Watermaker Store <contacto@mail.tu-dominio.com>
```

## 2. Prepare Turnstile

1. In Cloudflare, create a Turnstile site.
2. Add your Pages domain as an allowed hostname.
3. Copy the site key and secret key.

## 3. Configure Cloudflare Pages

In Cloudflare Pages for this project, add these environment variables:

```txt
RESEND_API_KEY=
CONTACT_TO_EMAIL=
CONTACT_FROM_EMAIL=
TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=
```

After saving them, redeploy the project.

Recommended build settings for Cloudflare Pages:

```txt
Build command: bun run build
Build output directory: dist
Functions directory: functions
```

Do not use the repository root (`.`) as the output directory. During Cloudflare builds, tooling can create `node_modules/`, and publishing the root can try to upload build tools as public assets.

## 4. Local test

1. Copy `.dev.vars.example` to `.dev.vars`.
2. Fill in real Resend/email values.
3. Keep the Turnstile test keys for local development:

```txt
TURNSTILE_SITE_KEY=1x00000000000000000000AA
TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA
```

These Cloudflare test keys always pass and work on `localhost` and `127.0.0.1`.
Do not mix a test site key with a production secret key, or a production site key with the test secret key.

4. Run:

```bash
bun run preview
```

This starts a local Cloudflare Pages environment with the `functions/` folder active, so `/api/contact` and `/api/contact-config` work locally.

## 5. Production test

1. Open the live site.
2. Go to the contact section.
3. Submit a test message with your own email.
4. Confirm:
   - The message reaches `CONTACT_TO_EMAIL`.
   - The reply-to is the visitor email.
   - Turnstile passes.

## Notes

- The contact endpoint is in `functions/api/contact.js`.
- The public Turnstile site key endpoint is in `functions/api/contact-config.js`.
- Resend requires `CONTACT_FROM_EMAIL` to use a verified sender/domain.
- If the form says it is not configured, one or more environment variables are missing.
- For production, use the real Turnstile site key and secret key from your Cloudflare widget. For local development, use the test pair shown above.
