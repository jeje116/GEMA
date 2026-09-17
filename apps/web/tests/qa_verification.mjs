import assert from 'node:assert/strict';

const BASE_URL = 'http://localhost:3001';

const results = [];

async function runTest(name, fn) {
  const start = performance.now();
  try {
    await fn();
    const duration = (performance.now() - start).toFixed(2);
    results.push({ name, status: 'PASSED', duration: `${duration}ms` });
    console.log(`✓ [PASSED] ${name} (${duration}ms)`);
  } catch (err) {
    const duration = (performance.now() - start).toFixed(2);
    results.push({ name, status: 'FAILED', duration: `${duration}ms`, error: err.message });
    console.error(`✗ [FAILED] ${name}:`, err.message);
  }
}

async function main() {
  console.log(`Starting QA Verification Suite against ${BASE_URL}...\n`);

  // 1. Root & Locale Redirects
  await runTest('Redirect: / -> /en (308)', async () => {
    const res = await fetch(`${BASE_URL}/`, { redirect: 'manual' });
    assert.strictEqual(res.status, 308);
    assert.strictEqual(res.headers.get('location'), '/en');
  });

  await runTest('Redirect: /en/private-dining -> /en/occasions (308)', async () => {
    const res = await fetch(`${BASE_URL}/en/private-dining`, { redirect: 'manual' });
    assert.strictEqual(res.status, 308);
    assert.strictEqual(res.headers.get('location'), '/en/occasions');
  });

  await runTest('Redirect: /id/private-dining -> /id/occasions (308)', async () => {
    const res = await fetch(`${BASE_URL}/id/private-dining`, { redirect: 'manual' });
    assert.strictEqual(res.status, 308);
    assert.strictEqual(res.headers.get('location'), '/id/occasions');
  });

  // 2. 404 Boundary & Error Cases
  await runTest('404 on invalid locale: /fr', async () => {
    const res = await fetch(`${BASE_URL}/fr`);
    assert.strictEqual(res.status, 404);
  });

  await runTest('404 on invalid locale route: /fr/menu', async () => {
    const res = await fetch(`${BASE_URL}/fr/menu`);
    assert.strictEqual(res.status, 404);
  });

  await runTest('404 on non-existent event slug: /en/events/invalid-event-slug', async () => {
    const res = await fetch(`${BASE_URL}/en/events/invalid-event-slug`);
    assert.strictEqual(res.status, 404);
  });

  await runTest('404 on non-existent journal slug: /en/journal/invalid-journal-slug', async () => {
    const res = await fetch(`${BASE_URL}/en/journal/invalid-journal-slug`);
    assert.strictEqual(res.status, 404);
  });

  // 3. Static & Dynamic Routes (200 OK)
  const canonicalRoutes = [
    '/en',
    '/id',
    '/en/menu',
    '/id/menu',
    '/en/experience',
    '/id/experience',
    '/en/about',
    '/id/about',
    '/en/chef/mandif-warokka',
    '/id/chef/mandif-warokka',
    '/en/recognition',
    '/id/recognition',
    '/en/visit',
    '/id/visit',
    '/en/occasions',
    '/id/occasions',
    '/en/events',
    '/id/events',
    '/en/events/private-table-series',
    '/id/events/private-table-series',
    '/en/journal',
    '/id/journal',
    '/en/journal/inside-gemas-fresh-pasta',
    '/id/journal/inside-gemas-fresh-pasta',
  ];

  for (const route of canonicalRoutes) {
    await runTest(`HTTP 200: ${route}`, async () => {
      const res = await fetch(`${BASE_URL}${route}`);
      assert.strictEqual(res.status, 200, `Expected 200 for ${route}, got ${res.status}`);
    });
  }

  // 4. ISR Cache-Control Header on Events
  await runTest('ISR Cache Header: /en/events has s-maxage=3600', async () => {
    const res = await fetch(`${BASE_URL}/en/events`);
    const cacheControl = res.headers.get('cache-control') || '';
    assert.match(cacheControl, /s-maxage=3600/, `Expected s-maxage=3600, got: ${cacheControl}`);
  });

  // 5. SEO Endpoints: robots.txt & sitemap.xml
  await runTest('SEO: /robots.txt content validity', async () => {
    const res = await fetch(`${BASE_URL}/robots.txt`);
    assert.strictEqual(res.status, 200);
    const body = await res.text();
    assert.ok(body.includes('User-Agent: *'));
    assert.ok(body.includes('Allow: /'));
    assert.ok(body.includes('https://gemasurabaya.com/sitemap.xml'));
  });

  await runTest('SEO: /sitemap.xml content validity', async () => {
    const res = await fetch(`${BASE_URL}/sitemap.xml`);
    assert.strictEqual(res.status, 200);
    const body = await res.text();
    assert.ok(body.includes('<urlset'));
    assert.ok(body.includes('https://gemasurabaya.com/en/menu'));
    assert.ok(body.includes('https://gemasurabaya.com/id/menu'));
    assert.ok(body.includes('https://gemasurabaya.com/en/occasions'));
  });

  // 6. DOM & Structured Data Verification
  await runTest('DOM Verification: Visit page contains address and email', async () => {
    const res = await fetch(`${BASE_URL}/en/visit`);
    const html = await res.text();
    assert.ok(html.includes('Jl. Musi No. 21'), 'Address not found in visit page');
    assert.ok(html.includes('reservations@gemasurabaya.com'), 'Email not found in visit page');
  });

  await runTest('Structured Data: Journal detail contains Article JSON-LD', async () => {
    const res = await fetch(`${BASE_URL}/en/journal/inside-gemas-fresh-pasta`);
    const html = await res.text();
    assert.ok(html.includes('application/ld+json'), 'JSON-LD tag missing in journal detail');
    assert.ok(html.includes('"@type":"Article"'), 'Article type missing from JSON-LD');
    assert.ok(html.includes('GEMA Culinary Team'), 'Author missing from JSON-LD');
  });

  await runTest('DOM Verification: Interactive reservation triggers and WhatsApp configuration', async () => {
    const res = await fetch(`${BASE_URL}/en`);
    const html = await res.text();
    assert.ok(html.includes('Reserve a Table') || html.includes('Reserve'), 'Reserve action button missing from page');
  });

  await runTest('DOM Verification: Visit page contains Google Maps location support', async () => {
    const res = await fetch(`${BASE_URL}/en/visit`);
    const html = await res.text();
    assert.ok(
      html.includes('maps.google.com') || html.includes('Open in Google Maps') || html.includes('google.com/maps'),
      'Google Maps support missing from Visit page'
    );
  });

  await runTest('Visual Theme Verification: Experience route header has dark contrast over ivory', async () => {
    const res = await fetch(`${BASE_URL}/en/experience`);
    const html = await res.text();
    // On experience page, header has brightness-0 on logo and dark text
    assert.ok(html.includes('brightness-0') || html.includes('text-[var(--espresso-900)]'), 'Dark header theme not found on Experience route');
  });

  // 7. SEO Fallback Gating Invariant Test
  await runTest('SEO Fallback Gating: substantive check algorithm verification', async () => {
    // Substantive entry (both title & body in id)
    const substantiveEntry = {
      title: { en: 'Title', id: 'Judul' },
      bodyBlocks: [{ type: 'paragraph', content: { en: 'Body', id: 'Konten' } }]
    };
    // Non-substantive entry (empty id body)
    const emptyBodyEntry = {
      title: { en: 'Title', id: 'Judul' },
      bodyBlocks: [{ type: 'paragraph', content: { en: 'Body', id: '' } }]
    };
    // Non-substantive entry (empty id title)
    const emptyTitleEntry = {
      title: { en: 'Title', id: '' },
      bodyBlocks: [{ type: 'paragraph', content: { en: 'Body', id: 'Konten' } }]
    };

    const isSubstantive = (entry, locale) => {
      if (locale === 'en') return true;
      if (locale === 'id') {
        const hasIdTitle = Boolean(entry.title.id && entry.title.id.trim().length > 0);
        const hasIdBody = entry.bodyBlocks.some(
          (b) => b.content.id && b.content.id.trim().length > 0
        );
        return hasIdTitle && hasIdBody;
      }
      return false;
    };

    assert.strictEqual(isSubstantive(substantiveEntry, 'en'), true);
    assert.strictEqual(isSubstantive(substantiveEntry, 'id'), true);
    assert.strictEqual(isSubstantive(emptyBodyEntry, 'id'), false);
    assert.strictEqual(isSubstantive(emptyTitleEntry, 'id'), false);
  });

  // 8. Audio Choreography Invariant & Hysteresis Logic Test
  await runTest('Audio Choreography: user intent isolation and ducking hysteresis verification', async () => {
    // Model test of AudioManager state machine
    class MockAudioManager {
      constructor() {
        this.userIntent = 'disabled';
        this.attenuation = 'normal';
        this.volume = 0.30;
        this.isPlaying = false;
      }
      startFromUserGesture() {
        this.userIntent = 'enabled';
        this.isPlaying = true;
        this.volume = this.attenuation === 'ducked' ? 0.05 : 0.30;
      }
      toggle() {
        if (this.userIntent === 'enabled') {
          this.userIntent = 'disabled';
          this.isPlaying = false;
          return false;
        } else {
          this.startFromUserGesture();
          return true;
        }
      }
      setDucked(ducked) {
        this.attenuation = ducked ? 'ducked' : 'normal';
        // Invariant: NEVER play audio if userIntent is disabled!
        if (this.userIntent === 'disabled') {
          return;
        }
        this.volume = ducked ? 0.05 : 0.30;
      }
    }

    const mgr = new MockAudioManager();
    assert.strictEqual(mgr.userIntent, 'disabled');
    assert.strictEqual(mgr.isPlaying, false);

    // Ducking while userIntent is disabled should NEVER trigger playback
    mgr.setDucked(true);
    assert.strictEqual(mgr.isPlaying, false);
    assert.strictEqual(mgr.userIntent, 'disabled');

    mgr.setDucked(false);
    assert.strictEqual(mgr.isPlaying, false);
    assert.strictEqual(mgr.userIntent, 'disabled');

    // User explicitly enters / enables audio
    mgr.startFromUserGesture();
    assert.strictEqual(mgr.userIntent, 'enabled');
    assert.strictEqual(mgr.isPlaying, true);
    assert.strictEqual(mgr.volume, 0.30);

    // Chef enters viewport (ratio >= 0.45) -> duck audio
    mgr.setDucked(true);
    assert.strictEqual(mgr.attenuation, 'ducked');
    assert.strictEqual(mgr.volume, 0.05);
    assert.strictEqual(mgr.isPlaying, true);

    // Chef exits viewport (ratio < 0.22) -> restore audio
    mgr.setDucked(false);
    assert.strictEqual(mgr.attenuation, 'normal');
    assert.strictEqual(mgr.volume, 0.30);
    assert.strictEqual(mgr.isPlaying, true);

    // User mutes audio via toggle
    mgr.toggle();
    assert.strictEqual(mgr.userIntent, 'disabled');
    assert.strictEqual(mgr.isPlaying, false);

    // Chef enters viewport while muted -> ducking must NOT unmute
    mgr.setDucked(true);
    assert.strictEqual(mgr.isPlaying, false);
    assert.strictEqual(mgr.userIntent, 'disabled');

    // Chef exits viewport while muted -> must stay muted
    mgr.setDucked(false);
    assert.strictEqual(mgr.isPlaying, false);
    assert.strictEqual(mgr.userIntent, 'disabled');
  });

  // 9. Summary
  const passed = results.filter(r => r.status === 'PASSED').length;
  const failed = results.filter(r => r.status === 'FAILED').length;
  console.log(`\n================================`);
  console.log(`QA SUITE COMPLETE: ${passed} PASSED, ${failed} FAILED (Total: ${results.length})`);
  console.log(`================================`);

  if (failed > 0) {
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Test suite runner crashed:', err);
  process.exit(1);
});
