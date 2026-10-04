import assert from 'node:assert/strict';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3001';

const routesToTest = [
  { path: '/en', expectedH1: 1, expectedJsonLd: ['Restaurant'] },
  { path: '/id', expectedH1: 1, expectedJsonLd: ['Restaurant'] },
  { path: '/en/about', expectedH1: 1 },
  { path: '/id/about', expectedH1: 1 },
  { path: '/en/experience', expectedH1: 1 },
  { path: '/id/experience', expectedH1: 1 },
  { path: '/en/menu', expectedH1: 1 },
  { path: '/id/menu', expectedH1: 1 },
  { path: '/en/occasions', expectedH1: 1 },
  { path: '/id/occasions', expectedH1: 1 },
  { path: '/en/visit', expectedH1: 1 },
  { path: '/id/visit', expectedH1: 1 },
  { path: '/en/recognition', expectedH1: 1 },
  { path: '/id/recognition', expectedH1: 1 },
  { path: '/en/events', expectedH1: 1 },
  { path: '/id/events', expectedH1: 1 },
  { path: '/en/journal', expectedH1: 1 },
  { path: '/id/journal', expectedH1: 1 },
  { path: '/en/chef/mandif-warokka', expectedH1: 1, expectedJsonLd: ['Person', 'BreadcrumbList'] },
  { path: '/id/chef/mandif-warokka', expectedH1: 1, expectedJsonLd: ['Person', 'BreadcrumbList'] },
  { path: '/en/events/private-table-series', expectedH1: 1, expectedJsonLd: ['Event', 'BreadcrumbList'] },
  { path: '/id/events/private-table-series', expectedH1: 1, expectedJsonLd: ['Event', 'BreadcrumbList'] },
  { path: '/en/journal/inside-gemas-fresh-pasta', expectedH1: 1, expectedJsonLd: ['Article', 'BreadcrumbList'] },
  { path: '/id/journal/inside-gemas-fresh-pasta', expectedH1: 1, expectedJsonLd: ['Article', 'BreadcrumbList'] },
];

function decodeHtml(html) {
  return html.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
}

async function runAudit() {
  console.log('--- STARTING COMPREHENSIVE SEO & DISCOVERABILITY AUDIT ---\n');
  let passedCount = 0;
  let failedCount = 0;

  for (const route of routesToTest) {
    const url = `${BASE_URL}${route.path}`;
    try {
      const res = await fetch(url);
      assert.strictEqual(res.status, 200, `Expected 200 for ${route.path}`);
      const rawHtml = await res.text();
      const html = decodeHtml(rawHtml);

      // 1. Check H1 count (must be exactly 1, no duplicate from GatewayExperience)
      const h1Matches = html.match(/<h1[\s>]/gi) || [];
      assert.strictEqual(
        h1Matches.length,
        route.expectedH1,
        `Expected ${route.expectedH1} <h1> on ${route.path}, found ${h1Matches.length}`
      );

      // 2. Check no 'Concept MVP' in DOM/metadata
      assert.ok(!html.includes('Concept MVP'), `Found 'Concept MVP' in ${route.path}`);

      // 3. Check title tag for no double branding suffix (e.g., '... — GEMA | GEMA...')
      const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
      const title = titleMatch ? titleMatch[1] : '';
      assert.ok(!title.includes('— GEMA |'), `Double branding suffix detected in title on ${route.path}: "${title}"`);
      assert.ok(title.includes('GEMA Restaurant & Societiet'), `Expected title branding on ${route.path}, got: "${title}"`);

      // 4. Check canonical and hreflang
      assert.ok(html.includes('<link rel="canonical"') || html.includes('rel="canonical"'), `Missing canonical link on ${route.path}`);
      assert.match(html, /hreflang="en"/i, `Missing hreflang en on ${route.path}`);
      assert.match(html, /hreflang="id"/i, `Missing hreflang id on ${route.path}`);

      // 5. Check no active web links to gemasurabaya.com
      const domainMatches = html.match(/https?:\/\/[a-z0-9.-]*gemasurabaya\.com[^\s"'>]*/gi) || [];
      const nonEmailDomainMatches = domainMatches.filter(d => !d.includes('mailto:'));
      assert.strictEqual(
        nonEmailDomainMatches.length,
        0,
        `Found non-email gemasurabaya.com domain in ${route.path}: ${nonEmailDomainMatches.join(', ')}`
      );

      // 6. Check expected JSON-LD types
      if (route.expectedJsonLd) {
        for (const type of route.expectedJsonLd) {
          const regex = new RegExp(`"@type"\\s*:\\s*"${type}"`);
          assert.ok(
            regex.test(html),
            `Missing expected JSON-LD @type "${type}" on ${route.path}`
          );
        }
      }

      // 7. Check OpenGraph tags
      assert.match(html, /property="og:title"/i, `Missing og:title on ${route.path}`);
      assert.match(html, /property="og:description"/i, `Missing og:description on ${route.path}`);
      assert.match(html, /property="og:url"/i, `Missing og:url on ${route.path}`);

      console.log(`✓ [AUDIT PASSED] ${route.path} (H1: ${h1Matches.length} | Title: "${title}" | JSON-LD: ${route.expectedJsonLd?.join(', ') || 'None'})`);
      passedCount++;
    } catch (err) {
      console.error(`✗ [AUDIT FAILED] ${route.path}:`, err.message);
      failedCount++;
    }
  }

  console.log(`\n--- AUDIT SUMMARY ---`);
  console.log(`Total Routes Tested: ${routesToTest.length}`);
  console.log(`Passed: ${passedCount}`);
  console.log(`Failed: ${failedCount}`);

  if (failedCount > 0) {
    process.exit(1);
  }
}

runAudit();
