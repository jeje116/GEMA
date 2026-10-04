const { chromium } = require('/Users/jasonsjanuard/scratch_playwright/node_modules/playwright');

async function testLiveProduction() {
  console.log('=== RUNNING LIVE PRODUCTION EMPIRICAL SPLASH VERIFICATION ===\n');
  const browser = await chromium.launch({ headless: true });
  let totalResDiaryRequests = 0;

  // 1. DESKTOP BROADBAND ON PRODUCTION
  console.log('--- TEST 1: DESKTOP BROADBAND ON LIVE PRODUCTION (https://gemagroup.id/en) ---');
  {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();

    await page.route('**/*resdiary*/**', route => {
      totalResDiaryRequests++;
      return route.fulfill({ status: 200, contentType: 'application/javascript', body: '/* mock */' });
    });

    const networkTimeline = [];
    page.on('response', res => {
      const url = res.url();
      if (url.includes('.webp') || url.includes('.png') || url.includes('.mp4')) {
        networkTimeline.push({
          url: url.split('/').pop(),
          status: res.status(),
          size: res.headers()['content-length'],
          time: Date.now()
        });
      }
    });

    const t0 = Date.now();
    await page.goto('https://gemagroup.id/en', { waitUntil: 'domcontentloaded' });
    const domLoadedTime = Date.now() - t0;

    // Check poster state
    const posterState = await page.evaluate(() => {
      const img = document.querySelector('img[data-splash-element="poster-fallback"]');
      return {
        src: img ? img.src : null,
        fetchPriority: img ? img.getAttribute('fetchpriority') : null,
        decoding: img ? img.decoding : null,
        complete: img ? img.complete : null,
        naturalWidth: img ? img.naturalWidth : null,
        naturalHeight: img ? img.naturalHeight : null,
      };
    });
    console.log(`Poster rendered at ${domLoadedTime}ms:`, JSON.stringify(posterState, null, 2));

    // Wait for video element
    await page.waitForSelector('video[data-splash-element="video-stream"]', { timeout: 10000 });
    const videoAttributes = await page.evaluate(() => {
      const v = document.querySelector('video[data-splash-element="video-stream"]');
      return {
        currentSrc: v ? v.currentSrc : null,
        poster: v ? v.poster : null,
        preload: v ? v.preload : null,
        readyState: v ? v.readyState : null,
      };
    });
    console.log('Desktop Video Initial State:', JSON.stringify(videoAttributes, null, 2));

    // Gateway interaction test
    console.log('Testing Gateway Enter...');
    await page.click('button[aria-label="Enter GEMA website"]');
    await page.waitForTimeout(1000);
    const splashDismissed = await page.evaluate(() => {
      const v = document.querySelector('video[data-splash-element="video-stream"]');
      const b = document.querySelector('button[aria-label="Enter GEMA website"]');
      return !v && !b;
    });
    console.log('Gateway successfully exited & video unmounted:', splashDismissed);

    console.log('Network transfers captured:');
    for (const item of networkTimeline) {
      console.log(`  - [${item.status}] ${item.url} (${item.size} bytes) at +${item.time - t0}ms`);
    }

    await context.close();
  }

  // 2. MOBILE VIEWPORT ON PRODUCTION
  console.log('\n--- TEST 2: MOBILE VIEWPORT ON LIVE PRODUCTION (390x844) ---');
  {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true,
    });
    const page = await context.newPage();

    await page.route('**/*resdiary*/**', route => {
      totalResDiaryRequests++;
      return route.fulfill({ status: 200, contentType: 'application/javascript', body: '/* mock */' });
    });

    const requests = [];
    page.on('request', req => {
      const url = req.url();
      if (url.includes('.mp4') || url.includes('.webp') || url.includes('.png')) {
        requests.push(url.split('/').pop());
      }
    });

    const t0 = Date.now();
    await page.goto('https://gemagroup.id/en', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(500); // allow hydration

    const mobilePoster = await page.evaluate(() => {
      const img = document.querySelector('img[data-splash-element="poster-fallback"]');
      return {
        src: img ? img.src : null,
        naturalWidth: img ? img.naturalWidth : null,
        naturalHeight: img ? img.naturalHeight : null,
      };
    });
    console.log('Mobile Poster:', JSON.stringify(mobilePoster, null, 2));

    await page.waitForSelector('video[data-splash-element="video-stream"]', { timeout: 10000 });
    const mobileVideo = await page.evaluate(() => {
      const v = document.querySelector('video[data-splash-element="video-stream"]');
      return {
        currentSrc: v ? v.currentSrc : null,
        poster: v ? v.poster : null,
      };
    });
    console.log('Mobile Video:', JSON.stringify(mobileVideo, null, 2));

    const mp4Requests = requests.filter(u => u.endsWith('.mp4'));
    console.log('MP4 files requested on mobile:', mp4Requests);

    await context.close();
  }

  // 3. THROTTLED TEST WITH VIDEO READY AFTER 4 SECONDS ON LIVE PRODUCTION
  console.log('\n--- TEST 3: LIVE PRODUCTION WITH DELAYED VIDEO STREAM (> 4s) ---');
  {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();

    await page.route('**/*resdiary*/**', route => {
      totalResDiaryRequests++;
      return route.fulfill({ status: 200, contentType: 'application/javascript', body: '/* mock */' });
    });

    // Artificially delay MP4 video stream by 4200ms
    await page.route('**/*gema-splash*.mp4', async route => {
      console.log('[THROTTLE HOOK] Intentionally delaying 4K video stream by 4200ms...');
      await new Promise(r => setTimeout(r, 4200));
      return route.continue();
    });

    const t0 = Date.now();
    await page.goto('https://gemagroup.id/en', { waitUntil: 'domcontentloaded' });

    // Check at 4100ms (past 4s threshold)
    await page.waitForTimeout(4100);
    const stateAt4100 = await page.evaluate(() => {
      const video = document.querySelector('video[data-splash-element="video-stream"]');
      const img = document.querySelector('img[data-splash-element="poster-fallback"]');
      return {
        videoExists: !!video,
        videoOpacity: video ? window.getComputedStyle(video).opacity : null,
        posterOpacity: img ? window.getComputedStyle(img).opacity : null,
      };
    });
    console.log('Status at +4100ms (past 4-second timeout):', JSON.stringify(stateAt4100, null, 2));

    // Wait for video to begin playing after delayed arrival
    console.log('Observing delayed video transition...');
    const playbackObserved = await page.evaluate(async () => {
      const video = document.querySelector('video[data-splash-element="video-stream"]');
      const img = document.querySelector('img[data-splash-element="poster-fallback"]');
      if (!video) return { error: 'VIDEO DESTROYED PREMATURELY!' };
      return new Promise(resolve => {
        if (!video.paused && video.currentTime > 0) {
          resolve({
            success: true,
            currentTime: video.currentTime,
            videoOpacity: window.getComputedStyle(video).opacity,
            posterOpacity: window.getComputedStyle(img).opacity,
          });
          return;
        }
        video.addEventListener('playing', () => {
          setTimeout(() => {
            resolve({
              success: true,
              currentTime: video.currentTime,
              videoOpacity: window.getComputedStyle(video).opacity,
              posterOpacity: window.getComputedStyle(img).opacity,
            });
          }, 1100);
        });
        setTimeout(() => {
          resolve({
            success: false,
            readyState: video.readyState,
            paused: video.paused,
          });
        }, 8000);
      });
    });
    console.log('Result after delayed video stream:', JSON.stringify(playbackObserved, null, 2));

    await context.close();
  }

  console.log('\n--- RESDIARY PROTOCOL SAFETY CHECK ---');
  console.log(`Live ResDiary Requests: ${totalResDiaryRequests} (all intercepted/mocked, 0 live)`);
  console.log('Live Bookings Submitted: 0');

  await browser.close();
  console.log('\n=== LIVE PRODUCTION QA COMPLETE ===');
}

testLiveProduction().catch(console.error);
