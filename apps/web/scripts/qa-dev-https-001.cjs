const { chromium } = require('playwright');
const path = require('path');

async function runDevHttpsQa() {
  const results = {
    httpBaseline: 'FAIL',
    httpsEndpoint: 'FAIL',
    hmrWebSocket: 'FAIL',
    resDiaryInlineUi: 'FAIL',
    brokenResDiaryImages: -1,
    insecureFallbackAbsent: 'FAIL',
    mixedContentErrors: 0,
    gateway: 'FAIL',
    mobile: 'FAIL',
    desktop: 'FAIL',
    productionReservationSubmitted: 'NO',
    productionBookingCreated: 'NO',
  };

  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
  });

  try {
    // ------------------------------------------------------------------------
    // 1. HTTP BASELINE CHECK (http://localhost:3001/en)
    // ------------------------------------------------------------------------
    console.log('--- 1. TESTING HTTP BASELINE (http://localhost:3001/en) ---');
    const httpContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const httpPage = await httpContext.newPage();
    const httpRes = await httpPage.goto('http://localhost:3001/en', { waitUntil: 'load' });
    if (httpRes && httpRes.status() === 200) {
      results.httpBaseline = 'PASS';
      console.log('HTTP Baseline http://localhost:3001/en loaded with status 200: PASS');
    }
    await httpContext.close();

    // ------------------------------------------------------------------------
    // 2. HTTPS DESKTOP QA (https://localhost:3002/en)
    // ------------------------------------------------------------------------
    console.log('\n--- 2. TESTING HTTPS DESKTOP (1440x900) ---');
    const httpsContext = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      ignoreHTTPSErrors: true,
    });
    const page = await httpsContext.newPage();

    let wsConnected = false;
    let wsUrl = '';
    page.on('websocket', ws => {
      wsConnected = true;
      wsUrl = ws.url();
      console.log('[QA] HMR WebSocket connected over HTTPS:', ws.url());
    });

    const insecureRequests = [];
    page.on('request', req => {
      const url = req.url();
      if (url.startsWith('http://')) {
        insecureRequests.push(url);
      }
    });

    console.log('Navigating to https://localhost:3002/en (natural window load)...');
    const httpsRes = await page.goto('https://localhost:3002/en', { waitUntil: 'load' });
    if (httpsRes && httpsRes.status() === 200) {
      results.httpsEndpoint = 'PASS';
      console.log('HTTPS endpoint https://localhost:3002/en loaded with status 200: PASS');
    }

    // Verify Gateway
    console.log('Verifying Gateway on HTTPS...');
    const gateway = page.locator('button[aria-label="Enter GEMA website"]');
    const gatewayVisible = await gateway.isVisible({ timeout: 4000 }).catch(() => false);
    if (gatewayVisible) {
      console.log('Gateway is visible on HTTPS: PASS');
      results.gateway = 'PASS';
      console.log('Waiting 3.2s for Gateway loading sequence to transition to idle...');
      await page.waitForTimeout(3200);
      await gateway.click();
      await page.waitForTimeout(1500);
    }

    // Check HMR WebSocket
    if (wsConnected) {
      results.hmrWebSocket = 'PASS';
      console.log(`HMR WebSocket active over HTTPS (${wsUrl}): PASS`);
    } else {
      await page.waitForTimeout(1000);
      if (wsConnected) {
        results.hmrWebSocket = 'PASS';
        console.log(`HMR WebSocket active over HTTPS (${wsUrl}): PASS`);
      }
    }

    // Open Reservation Drawer
    console.log('Opening Reservation Drawer on HTTPS...');
    await page.keyboard.press('Escape');
    const reserveBtn = page.locator('button:has-text("Reserve a Table"):visible, button:has-text("Reservations"):visible, button:has-text("RESERVE"):visible').first();
    await reserveBtn.click({ force: true });
    await page.waitForSelector('#reservation-title', { state: 'visible', timeout: 5000 });
    console.log('Reservation drawer opened successfully on HTTPS: PASS');

    // Wait for ResDiary widget to settle
    await page.waitForTimeout(3500);

    // Inspect ResDiary Widget DOM inside #rd-widget-frame
    const widgetData = await page.evaluate(() => {
      const frame = document.getElementById('rd-widget-frame');
      if (!frame) return { error: 'No frame' };

      const imgs = Array.from(frame.querySelectorAll('img')).map(img => ({
        src: img.src,
        srcAttr: img.getAttribute('src'),
        alt: img.alt,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        complete: img.complete,
        outerHTML: img.outerHTML,
      }));

      const hasFallbackBtn = !!frame.querySelector('.insecure-fallback-book-button');
      const hasCalendar = !!frame.querySelector('.datepicker, #datepicker, [data-bind*="date"], [data-bind*="Date"], table');
      const hasCovers = !!frame.querySelector('.covers-selector, select, [data-bind*="covers"], [data-bind*="PartySize"]');
      const hasTime = !!frame.querySelector('.time-slot, [data-bind*="timeslot"], [data-bind*="time"], [data-bind*="Time"]');

      return {
        text: frame.innerText.slice(0, 300),
        imgs,
        hasFallbackBtn,
        hasCalendar,
        hasCovers,
        hasTime,
      };
    });

    console.log('\nWidget Inspection on HTTPS:', JSON.stringify(widgetData, null, 2));

    const brokenImages = widgetData.imgs.filter(img => img.naturalWidth === 0 && img.srcAttr !== null);
    results.brokenResDiaryImages = brokenImages.length;
    console.log(`Broken ResDiary images on HTTPS: ${results.brokenResDiaryImages}`);

    if (!widgetData.hasFallbackBtn) {
      results.insecureFallbackAbsent = 'PASS';
      console.log('Insecure fallback button is ABSENT on HTTPS: PASS');
    }

    if (widgetData.hasCalendar && results.brokenResDiaryImages === 0 && !widgetData.hasFallbackBtn) {
      results.resDiaryInlineUi = 'PASS';
      results.desktop = 'PASS';
      console.log('Full secure inline ResDiary reservation UI active on HTTPS: PASS');
    }

    // Check mixed content
    results.mixedContentErrors = insecureRequests.length;
    console.log(`Insecure (HTTP) requests initiated under HTTPS: ${insecureRequests.length}`);

    await httpsContext.close();

    // ------------------------------------------------------------------------
    // 3. HTTPS MOBILE QA (390x844 - iPhone 14)
    // ------------------------------------------------------------------------
    console.log('\n--- 3. TESTING HTTPS MOBILE (390x844) ---');
    const mobileContext = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true,
      ignoreHTTPSErrors: true,
    });
    const mobilePage = await mobileContext.newPage();
    await mobilePage.goto('https://localhost:3002/en', { waitUntil: 'load' });

    const mobileGateway = mobilePage.locator('button[aria-label="Enter GEMA website"]');
    if (await mobileGateway.isVisible({ timeout: 4000 }).catch(() => false)) {
      await mobilePage.waitForTimeout(3200);
      await mobileGateway.click();
      await mobilePage.waitForTimeout(1500);
    }

    // Click visible mobile Reserve CTA
    console.log('Clicking visible mobile Reserve button...');
    const mobileReserveBtn = mobilePage.locator('button:has-text("RESERVE"):visible, button:has-text("Reserve"):visible').first();
    await mobileReserveBtn.click({ force: true });
    await mobilePage.waitForSelector('#reservation-title', { state: 'visible', timeout: 5000 });
    await mobilePage.waitForTimeout(3500);

    const mobileWidgetValid = await mobilePage.evaluate(() => {
      const frame = document.getElementById('rd-widget-frame');
      if (!frame) return false;
      const hasFallback = !!frame.querySelector('.insecure-fallback-book-button');
      const brokenImgs = Array.from(frame.querySelectorAll('img')).filter(img => img.naturalWidth === 0 && img.getAttribute('src') !== null);
      const hasCalendar = !!frame.querySelector('.datepicker, #datepicker, [data-bind*="date"], [data-bind*="Date"], table');
      return !hasFallback && brokenImgs.length === 0 && hasCalendar;
    });

    if (mobileWidgetValid) {
      results.mobile = 'PASS';
      console.log('Mobile 390x844 ResDiary inline widget rendering: PASS');
    }

    await mobileContext.close();

  } finally {
    await browser.close();
  }

  console.log('\n===============================================================');
  console.log('DEV-HTTPS-001 QA SUMMARY:');
  console.log(JSON.stringify(results, null, 2));
  console.log('===============================================================');

  return results;
}

runDevHttpsQa().catch(err => {
  console.error('QA Fatal Error:', err);
  process.exit(1);
});
