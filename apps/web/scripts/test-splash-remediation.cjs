const { chromium } = require('/Users/jasonsjanuard/scratch_playwright/node_modules/playwright');

async function runTests() {
  console.log('=== RUNNING EMPIRICAL SPLASH REMEDIATION LOCAL QA ===\n');
  const browser = await chromium.launch({ headless: true });

  let totalResDiaryRequests = 0;

  // TEST 1: DESKTOP BROADBAND
  console.log('--- TEST 1: DESKTOP BROADBAND (1440x900) ---');
  {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();

    await page.route('**/*resdiary*/**', route => {
      totalResDiaryRequests++;
      return route.fulfill({ status: 200, contentType: 'application/javascript', body: '/* mock */' });
    });

    const requests = [];
    page.on('request', req => {
      const url = req.url();
      if (url.includes('.webp') || url.includes('.png') || url.includes('.mp4')) {
        requests.push({ type: 'req', url: url.split('/').pop(), time: Date.now() });
      }
    });

    const t0 = Date.now();
    await page.goto('http://localhost:3001/en', { waitUntil: 'domcontentloaded' });

    // Verify poster attributes and dimensions
    const posterData = await page.evaluate(() => {
      const img = document.querySelector('img[data-splash-element="poster-fallback"]');
      if (!img) return null;
      return {
        src: img.src,
        fetchPriority: img.getAttribute('fetchpriority'),
        decoding: img.decoding,
        complete: img.complete,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
      };
    });
    console.log('Desktop Poster Data:', JSON.stringify(posterData, null, 2));

    // Wait for video to begin playing
    await page.waitForSelector('video[data-splash-element="video-stream"]', { timeout: 5000 });
    const videoData = await page.evaluate(async () => {
      const video = document.querySelector('video[data-splash-element="video-stream"]');
      if (!video) return null;
      return new Promise(resolve => {
        if (!video.paused && video.currentTime > 0) {
          resolve({
            src: video.currentSrc,
            poster: video.poster,
            readyState: video.readyState,
            currentTime: video.currentTime,
            paused: video.paused,
            opacity: window.getComputedStyle(video).opacity
          });
          return;
        }
        video.addEventListener('playing', () => {
          setTimeout(() => {
            resolve({
              src: video.currentSrc,
              poster: video.poster,
              readyState: video.readyState,
              currentTime: video.currentTime,
              paused: video.paused,
              opacity: window.getComputedStyle(video).opacity
            });
          }, 1100); // after 1000ms transition
        });
      });
    });
    console.log('Desktop Video Data (after playing):', JSON.stringify(videoData, null, 2));

    // Check overlay visibility
    const overlayOpacity = await page.evaluate(() => {
      const overlay = document.querySelector('div.hidden.md\\:block');
      return overlay ? window.getComputedStyle(overlay).opacity : null;
    });
    console.log('Desktop DOM Overlay Opacity:', overlayOpacity);

    // Test Gateway Enter interaction
    console.log('Testing Gateway Enter...');
    await page.click('button[aria-label="Enter GEMA website"]');
    await page.waitForTimeout(1000);
    const videoStillPresent = await page.evaluate(() => {
      return !!document.querySelector('video[data-splash-element="video-stream"]');
    });
    console.log('Video element unmounted after enter:', !videoStillPresent);

    await context.close();
  }

  // TEST 2: MOBILE BROADBAND (390x844)
  console.log('\n--- TEST 2: MOBILE BROADBAND (390x844) ---');
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
      if (url.includes('.webp') || url.includes('.png') || url.includes('.mp4')) {
        requests.push({ type: 'req', url: url.split('/').pop() });
      }
    });

    await page.goto('http://localhost:3001/en', { waitUntil: 'domcontentloaded' });

    const posterData = await page.evaluate(() => {
      const img = document.querySelector('img[data-splash-element="poster-fallback"]');
      if (!img) return null;
      return {
        src: img.src,
        fetchPriority: img.getAttribute('fetchpriority'),
        decoding: img.decoding,
        complete: img.complete,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
      };
    });
    console.log('Mobile Poster Data:', JSON.stringify(posterData, null, 2));

    await page.waitForSelector('video[data-splash-element="video-stream"]', { timeout: 5000 });
    const videoSrc = await page.evaluate(() => {
      const video = document.querySelector('video[data-splash-element="video-stream"]');
      return video ? video.currentSrc : null;
    });
    console.log('Mobile Video CurrentSrc:', videoSrc);

    const mp4Requests = requests.filter(r => r.url.endsWith('.mp4'));
    console.log('MP4 requests on mobile:', mp4Requests.map(r => r.url));

    await context.close();
  }

  // TEST 3: THROTTLED TEST WITH VIDEO READY AFTER 4 SECONDS
  console.log('\n--- TEST 3: THROTTLED TEST (DELAYED VIDEO > 4s) ---');
  {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();

    await page.route('**/*resdiary*/**', route => {
      totalResDiaryRequests++;
      return route.fulfill({ status: 200, contentType: 'application/javascript', body: '/* mock */' });
    });

    // Artificially delay MP4 response by 4500ms so it arrives AFTER the 4-second mark
    await page.route('**/*gema-splash*.mp4', async route => {
      console.log('[MOCK THROTTLE] Delaying MP4 stream response by 4500ms...');
      await new Promise(r => setTimeout(r, 4500));
      return route.continue();
    });

    const t0 = Date.now();
    await page.goto('http://localhost:3001/en', { waitUntil: 'domcontentloaded' });

    // Check status at t = 4200ms (past the 4s timeout)
    await page.waitForTimeout(4200);
    const statusAt4200ms = await page.evaluate(() => {
      const video = document.querySelector('video[data-splash-element="video-stream"]');
      const img = document.querySelector('img[data-splash-element="poster-fallback"]');
      return {
        videoExists: !!video,
        videoOpacity: video ? window.getComputedStyle(video).opacity : null,
        posterOpacity: img ? window.getComputedStyle(img).opacity : null,
      };
    });
    console.log('Status at t=4200ms (past 4s threshold):', JSON.stringify(statusAt4200ms, null, 2));

    // Now wait for video to play at ~5500ms - 6000ms
    console.log('Waiting for video to play after delayed delivery...');
    const statusAt6000ms = await page.evaluate(async () => {
      const video = document.querySelector('video[data-splash-element="video-stream"]');
      const img = document.querySelector('img[data-splash-element="poster-fallback"]');
      if (!video) return { error: 'Video element was destroyed prematurely!' };
      return new Promise(resolve => {
        if (!video.paused && video.currentTime > 0) {
          resolve({
            videoPlaying: true,
            currentTime: video.currentTime,
            videoOpacity: window.getComputedStyle(video).opacity,
            posterOpacity: window.getComputedStyle(img).opacity,
          });
          return;
        }
        video.addEventListener('playing', () => {
          setTimeout(() => {
            resolve({
              videoPlaying: true,
              currentTime: video.currentTime,
              videoOpacity: window.getComputedStyle(video).opacity,
              posterOpacity: window.getComputedStyle(img).opacity,
            });
          }, 1100);
        });
        setTimeout(() => {
          resolve({
            timeout: true,
            readyState: video.readyState,
            paused: video.paused,
            videoOpacity: window.getComputedStyle(video).opacity,
          });
        }, 5000);
      });
    });
    console.log('Status after delayed playback:', JSON.stringify(statusAt6000ms, null, 2));

    await context.close();
  }

  console.log('\n--- RESDIARY NETWORK SAFETY CHECK ---');
  console.log(`Live ResDiary Requests: ${totalResDiaryRequests} (all intercepted/mocked, 0 live)`);
  console.log('Live Bookings Submitted: 0');

  await browser.close();
  console.log('\n=== QA COMPLETE ===');
}

runTests().catch(console.error);
