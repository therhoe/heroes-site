// Product Page X-Ray fetch proxy
// Fetches a Shopify product page server-side so the static site at
// therealheroesofecommerce.com can read its HTML (browsers block
// cross-origin reads). Deploy on Cloudflare Workers — see README.md.

const ALLOWED_ORIGINS = [
  'https://therealheroesofecommerce.com',
  'https://www.therealheroesofecommerce.com',
];

const MAX_BYTES = 3_000_000; // 3MB of HTML is plenty for any product page

export default {
  async fetch(request) {
    const origin = request.headers.get('Origin') || '';
    const cors = {
      'Access-Control-Allow-Origin': ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Vary': 'Origin',
    };
    if (request.method === 'OPTIONS') return new Response(null, { headers: cors });
    if (request.method !== 'GET') return new Response('method not allowed', { status: 405, headers: cors });

    const raw = new URL(request.url).searchParams.get('url');
    let target;
    try { target = new URL(raw); } catch { return new Response('invalid url', { status: 400, headers: cors }); }

    if (!/^https?:$/.test(target.protocol)) return new Response('http(s) urls only', { status: 400, headers: cors });
    if (!target.pathname.includes('/products/')) return new Response('not a product page url', { status: 400, headers: cors });
    // keep the proxy from being pointed at internal/private hosts
    if (!target.hostname.includes('.') ||
        /^(localhost|127\.|0\.|10\.|192\.168\.|169\.254\.|172\.(1[6-9]|2\d|3[01])\.)/i.test(target.hostname) ||
        /^\d+\.\d+\.\d+\.\d+$/.test(target.hostname)) {
      return new Response('host not allowed', { status: 400, headers: cors });
    }

    let resp;
    try {
      resp = await fetch(target.toString(), {
        redirect: 'follow',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml',
          'Accept-Language': 'en-US,en;q=0.9',
        },
        cf: { cacheTtl: 300, cacheEverything: true },
      });
    } catch (e) {
      return new Response('fetch failed: ' + e.message, { status: 502, headers: cors });
    }

    const text = (await resp.text()).slice(0, MAX_BYTES);
    return new Response(text, {
      status: resp.status,
      headers: {
        ...cors,
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=300',
      },
    });
  },
};
