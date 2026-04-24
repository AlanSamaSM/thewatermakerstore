# decap-oauth

GitHub OAuth proxy for Decap CMS. Deployed as a Cloudflare Worker.

## One-time setup

1. **Create a GitHub OAuth App**
   https://github.com/settings/developers → **New OAuth App**
   - Application name: `Watermaker Store CMS`
   - Homepage URL: `https://thewatermakerstore.alansama2906.workers.dev`
   - Authorization callback URL: `https://decap-oauth.alansama2906.workers.dev/callback`
   - Copy the **Client ID** and generate a **Client Secret**

2. **Install deps + set secrets**
   ```
   cd decap-oauth
   npm install
   npx wrangler secret put CLIENT_ID
   npx wrangler secret put CLIENT_SECRET
   ```

3. **Deploy**
   ```
   npx wrangler deploy
   ```
   Confirm the deployed URL matches `https://decap-oauth.alansama2906.workers.dev`
   (same as the callback URL you configured on GitHub).

## Updating later
Edit `src/index.js`, then `npx wrangler deploy`.
