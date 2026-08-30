# Deploying the X-Ray proxy worker (one time, ~5 minutes)

The Product Page X-Ray tool at `/product-page-xray.html` needs this tiny proxy
because browsers can't read other websites' HTML directly. It runs on
Cloudflare's free tier (100,000 requests/day — far more than needed).

## Steps

1. Create a free account at https://dash.cloudflare.com/sign-up (skip any
   domain-setup prompts — not needed for Workers).
2. In the left sidebar: **Workers & Pages** → **Create** → **Create Worker**.
3. Give it a name like `xray-proxy` → **Deploy** (it deploys a hello-world first).
4. Click **Edit code**, delete everything in the editor, paste the entire
   contents of `worker.js` from this folder, then **Deploy** (top right).
5. Copy the worker's URL — it looks like
   `https://xray-proxy.<your-subdomain>.workers.dev`.
6. Give that URL to Claude ("the worker url is …") — it gets pasted into the
   `PROXY` constant near the top of the `<script>` in `product-page-xray.html`,
   and the tool goes live. (You can also edit that line yourself on GitHub.)

## Notes

- The worker only accepts `/products/` URLs, refuses private/internal hosts,
  and only serves the therealheroesofecommerce.com origin — it can't be
  freeloaded as a general-purpose proxy.
- Responses are cached for 5 minutes, so repeat analyses of the same page
  don't hammer anyone's store.
- To update it later: Workers & Pages → xray-proxy → Edit code.
