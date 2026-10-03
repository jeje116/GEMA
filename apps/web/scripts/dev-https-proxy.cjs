/**
 * GEMA — Local HTTPS Development Reverse Proxy (DEV-HTTPS-001)
 *
 * Provides a secure local HTTPS entry point on https://localhost:3002 forwarding
 * to the default Next.js development server on http://localhost:3001.
 *
 * Primary purpose: Visual and functional QA of the official ResDiary JavaScript widget.
 * Features:
 * - Native Node.js implementation (zero new npm dependencies)
 * - Automatic local SAN certificate generation (DNS:localhost, IP:127.0.0.1)
 * - Full WebSocket / HMR proxy support for Next.js Turbopack Fast Refresh
 * - Strictly local development (never alters production architecture)
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const HTTPS_PORT = parseInt(process.env.HTTPS_PORT || '3002', 10);
const HTTP_TARGET_PORT = parseInt(process.env.HTTP_PORT || '3001', 10);
const CERTS_DIR = path.resolve(__dirname, '..', '.certs');
const CERT_FILE = path.join(CERTS_DIR, 'localhost-cert.pem');
const KEY_FILE = path.join(CERTS_DIR, 'localhost-key.pem');

function ensureCertificates() {
  if (fs.existsSync(CERT_FILE) && fs.existsSync(KEY_FILE)) {
    return { cert: fs.readFileSync(CERT_FILE), key: fs.readFileSync(KEY_FILE) };
  }

  if (!fs.existsSync(CERTS_DIR)) {
    fs.mkdirSync(CERTS_DIR, { recursive: true });
  }

  console.log('[GEMA HTTPS] Generating local development certificate with SAN (localhost, 127.0.0.1)...');
  try {
    const cmd = `openssl req -x509 -newkey rsa:2048 -nodes -sha256 -days 365 -subj '/CN=localhost' -addext 'subjectAltName=DNS:localhost,IP:127.0.0.1' -keyout "${KEY_FILE}" -out "${CERT_FILE}"`;
    execSync(cmd, { stdio: 'pipe' });
    console.log(`[GEMA HTTPS] Certificate created at: ${CERT_FILE}`);
    console.log(`[GEMA HTTPS] Private key created at: ${KEY_FILE}`);
  } catch (err) {
    console.error('[GEMA HTTPS] Failed to generate local certificate using openssl:', err.message);
    process.exit(1);
  }

  return { cert: fs.readFileSync(CERT_FILE), key: fs.readFileSync(KEY_FILE) };
}

function startProxy() {
  const credentials = ensureCertificates();

  // Create HTTPS server
  const server = https.createServer(credentials, (req, res) => {
    const proxyReq = http.request(
      {
        hostname: 'localhost',
        port: HTTP_TARGET_PORT,
        path: req.url,
        method: req.method,
        headers: {
          ...req.headers,
          host: `localhost:${HTTP_TARGET_PORT}`,
          'x-forwarded-proto': 'https',
          'x-forwarded-host': req.headers.host || `localhost:${HTTPS_PORT}`,
          'x-forwarded-port': String(HTTPS_PORT),
        },
      },
      proxyRes => {
        res.writeHead(proxyRes.statusCode, proxyRes.headers);
        proxyRes.pipe(res, { end: true });
      }
    );

    proxyReq.on('error', err => {
      if (err.code === 'ECONNREFUSED') {
        res.writeHead(502, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(
          `<html><body style="font-family:sans-serif;padding:2rem;">` +
          `<h2>[GEMA HTTPS Proxy] 502 Bad Gateway</h2>` +
          `<p>Could not connect to target Next.js server at <code>http://localhost:${HTTP_TARGET_PORT}</code>.</p>` +
          `<p>Please ensure that <code>npm run dev</code> is running in another terminal.</p>` +
          `</body></html>`
        );
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end(`Proxy error: ${err.message}`);
      }
    });

    req.pipe(proxyReq, { end: true });
  });

  // Handle WebSocket upgrade (Next.js Turbopack HMR / Fast Refresh)
  server.on('upgrade', (req, clientSocket, head) => {
    const proxyReq = http.request({
      hostname: 'localhost',
      port: HTTP_TARGET_PORT,
      path: req.url,
      method: req.method,
      headers: {
        ...req.headers,
        host: `localhost:${HTTP_TARGET_PORT}`,
        'x-forwarded-proto': 'https',
      },
    });

    proxyReq.on('upgrade', (proxyRes, serverSocket, upgradeHead) => {
      clientSocket.write(
        `HTTP/${proxyRes.httpVersion} ${proxyRes.statusCode} ${proxyRes.statusMessage}\r\n` +
        Object.entries(proxyRes.headers)
          .map(([k, v]) => `${k}: ${v}\r\n`)
          .join('') +
        '\r\n'
      );
      if (upgradeHead && upgradeHead.length) {
        clientSocket.write(upgradeHead);
      }
      serverSocket.pipe(clientSocket);
      clientSocket.pipe(serverSocket);
    });

    proxyReq.on('error', () => {
      clientSocket.destroy();
    });

    proxyReq.end();
  });

  server.listen(HTTPS_PORT, () => {
    console.log('===============================================================');
    console.log(`[GEMA HTTPS] Secure Local Development Proxy Running`);
    console.log(`===============================================================`);
    console.log(`  HTTPS QA URL:    https://localhost:${HTTPS_PORT}`);
    console.log(`  Target HTTP Dev: http://localhost:${HTTP_TARGET_PORT}`);
    console.log(`---------------------------------------------------------------`);
    console.log(`  ResDiary Widget: Full inline secure booking experience active`);
    console.log(`  Turbopack HMR:   WebSockets forwarded for live reloads`);
    console.log(`  Production Safety: Live GemaSurabaya/2025 venue — DO NOT BOOK`);
    console.log(`===============================================================\n`);
  });

  const handleShutdown = () => {
    console.log('\n[GEMA HTTPS] Shutting down HTTPS proxy...');
    server.close(() => {
      process.exit(0);
    });
  };

  process.on('SIGINT', handleShutdown);
  process.on('SIGTERM', handleShutdown);

  return server;
}

if (require.main === module) {
  startProxy();
}

module.exports = { startProxy, ensureCertificates };
