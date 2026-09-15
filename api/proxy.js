'use strict';

var MAX_RESPONSE_BYTES = 12 * 1024 * 1024;
var REQUEST_TIMEOUT_MS = 18000;

var PROVIDERS = {
  starshort: { origin: 'https://drakula.goodbos.online', auth: 'query' },
  freereels: { origin: 'https://drakula.goodbos.online', auth: 'query' },
  fundrama: { origin: 'https://drakula.goodbos.online', auth: 'query' },
  microdrama: { origin: 'https://drakula.goodbos.online', auth: 'query' },
  cubetv: { origin: 'https://cubetv.goodbos.online', auth: 'query' },
  dotdrama: { origin: 'https://dotdrama.goodbos.online', auth: 'query' },
  dramabite: { origin: 'https://dramabite.goodbos.online', auth: 'query' },
  dramanova: { origin: 'https://dramanova.goodbos.online', auth: 'query' },
  dramawave: { origin: 'https://dramawave.goodbos.online', auth: 'query' },
  flareflow: { origin: 'https://plerplow.goodbos.online', auth: 'query' },
  goodshort: { origin: 'https://goodshort.goodbos.online', auth: 'query' },
  happyshort: { origin: 'https://happyshort.goodbos.online', auth: 'query' },
  idrama: { origin: 'https://idrama.goodbos.online', auth: 'query' },
  melolo: { origin: 'https://melolo.goodbos.online', auth: 'query' },
  rapidtv: { origin: 'https://rapidtv.goodbos.online', auth: 'query' },
  reelife: { origin: 'https://reelife.goodbos.online', auth: 'query' },
  serialplus: { origin: 'https://serealplus.goodbos.online', auth: 'query' },
  shortmax: { origin: 'https://shortmax.goodbos.online', auth: 'query' },
  shortswave: { origin: 'https://shortwave.goodbos.online', auth: 'query' },
  flextv: { origin: 'https://flextv.goodbos.online', auth: 'query' },
  vigloo: { origin: 'https://vigloo.goodbos.online', auth: 'header' },
  dramabox: { origin: 'https://dramabox.goodbos.online', auth: 'header' },
  netshort: { origin: 'https://netshort.goodbos.online', auth: 'query' },
  velolo: { origin: 'https://velolo.goodbos.online', auth: 'query' },
  reelshort: { origin: 'https://reelshort.goodbos.online', auth: 'query' },
  flickreels: { origin: 'https://flickreels.goodbos.online', auth: 'query' },
  stardusttv: { origin: 'https://stardusttv2.goodbos.online', auth: 'header' },
  reelbuzz: { origin: 'https://reelbuzz.goodbos.online', auth: 'query' },
  moboreels: { origin: 'https://moboreels.goodbos.online', auth: 'query' },
  pinedrama: { origin: 'https://pinedrama.goodbos.online', auth: 'query' },
  raptdrama: { origin: 'https://raptdrama.goodbos.online', auth: 'header' },
  kalostv: { origin: 'https://kalostv.goodbos.online', auth: 'query' },
  vibeshort: { origin: 'https://vibeshort.goodbos.online', auth: 'header' },
  storyreel: { origin: 'https://storyreel.goodbos.online', auth: 'header' }
};

var FIXED_BROWSER_ORIGINS = {
  'https://missnapokita.github.io': true,
  'https://player.bidamax.org': true,
  'http://localhost:3000': true,
  'http://localhost:5173': true,
  'http://127.0.0.1:3000': true,
  'http://127.0.0.1:5173': true
};

function isAllowedBrowserOrigin(origin) {
  if (!origin) return true;
  if (FIXED_BROWSER_ORIGINS[origin]) return true;
  try {
    var parsed = new URL(origin);
    return parsed.protocol === 'https:' && /\.vercel\.app$/i.test(parsed.hostname);
  } catch (error) {
    return false;
  }
}

function applyCors(req, res) {
  var origin = String(req.headers.origin || '');
  if (origin && isAllowedBrowserOrigin(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Max-Age', '86400');
  res.setHeader('Cache-Control', 'no-store, max-age=0');
}

function sendJson(res, status, payload) {
  res.status(status);
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(payload));
}

function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') return JSON.parse(req.body);
  return {};
}

function validApiKey(value) {
  return /^[A-Fa-f0-9]{32}$/.test(String(value || ''));
}

module.exports = async function handler(req, res) {
  applyCors(req, res);

  if (!isAllowedBrowserOrigin(String(req.headers.origin || ''))) {
    return sendJson(res, 403, { success: false, error: 'This browser origin is not allowed.' });
  }

  if (req.method === 'OPTIONS') {
    res.status(204);
    return res.end();
  }

  if (req.method === 'GET') {
    return sendJson(res, 200, {
      success: true,
      service: 'DramaBos provider proxy',
      provider_count: Object.keys(PROVIDERS).length
    });
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'GET,POST,OPTIONS');
    return sendJson(res, 405, { success: false, error: 'Method not allowed.' });
  }

  var body;
  try {
    body = readBody(req);
  } catch (error) {
    return sendJson(res, 400, { success: false, error: 'Invalid JSON request.' });
  }

  var providerId = String(body.providerId || '').toLowerCase();
  var provider = PROVIDERS[providerId];
  if (!provider) {
    return sendJson(res, 400, { success: false, error: 'Unknown or unsupported provider.' });
  }

  var target;
  try {
    target = new URL(String(body.url || ''));
  } catch (error) {
    return sendJson(res, 400, { success: false, error: 'Invalid provider URL.' });
  }

  if (
    target.protocol !== 'https:' ||
    target.origin !== provider.origin ||
    target.username ||
    target.password ||
    target.hash
  ) {
    return sendJson(res, 403, { success: false, error: 'Provider destination is not allowed.' });
  }

  var apiKey = String(body.apiKey || '').trim();
  if (provider.auth !== 'none' && !validApiKey(apiKey)) {
    return sendJson(res, 400, { success: false, error: 'A valid 32-character API key is required.' });
  }

  target.searchParams.delete('code');
  var upstreamHeaders = {
    Accept: 'application/json, text/plain;q=0.9, */*;q=0.5',
    'User-Agent': 'DramaBos-Provider-Test/1.0'
  };
  if (provider.auth === 'query') target.searchParams.set('code', apiKey);
  if (provider.auth === 'header') upstreamHeaders['x-token'] = apiKey;

  var controller = new AbortController();
  var timeout = setTimeout(function () { controller.abort(); }, REQUEST_TIMEOUT_MS);

  try {
    var upstream = await fetch(target.toString(), {
      method: 'GET',
      headers: upstreamHeaders,
      redirect: 'manual',
      signal: controller.signal
    });
    if (upstream.status >= 300 && upstream.status < 400) {
      return sendJson(res, 502, { success: false, error: 'Provider redirect was blocked by the destination allowlist.' });
    }
    var bytes = Buffer.from(await upstream.arrayBuffer());
    if (bytes.length > MAX_RESPONSE_BYTES) {
      return sendJson(res, 502, { success: false, error: 'Provider response is too large.' });
    }
    res.status(upstream.status);
    res.setHeader('Content-Type', upstream.headers.get('content-type') || 'application/json; charset=utf-8');
    res.setHeader('X-DramaBos-Provider', providerId);
    res.setHeader('X-DramaBos-Route', 'proxy');
    return res.end(bytes);
  } catch (error) {
    return sendJson(res, error && error.name === 'AbortError' ? 504 : 502, {
      success: false,
      error: error && error.name === 'AbortError' ? 'Provider request timed out.' : 'Provider request failed.'
    });
  } finally {
    clearTimeout(timeout);
  }
};
