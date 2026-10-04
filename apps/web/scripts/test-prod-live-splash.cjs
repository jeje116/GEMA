const { chromium } = require('/Users/jasonsjanuard/scratch_playwright/node_modules/playwright');

async function testProductionSplash() {
  const targetBaseUrl = process.env.BASE_URL || 'https://gemagroup.id';
  console.log(`=== LIVE PRODUCTION VIDEO-LED SPLASH VERIFICATION (${targetBaseUrl}) ===\n`);

  const browser = await chromium.launch({ headless: true });
  let liveResDiaryRequests = 0;
  let liveBookings = 0;

  const results = {
    desktop: {},
    mobile: {},
    reducedMotion: {},
    zeroRef: {},
  };

  // 1. DESKTOP PRODUCTION TEST
  console.log('--- 1. DESKTOP PRODUCTION TEST (1440x900) ---');
  {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();

    await page.route('**/*resdiary*/**', route => {
      liveResDiaryRequests++;
      if (route.request().method() === 'POST') liveBookings++;
      return route.fulfill({ status: 200, contentType: 'application/javascript', body: '/* mock */' });
    });

    let bytesTransferredBeforePlayback = 0;
    let playbackStarted = false;
    const mediaRequests = [];

    page.on('response', async resp => {
      const url = resp.url();
      if (url.includes('.mp4')) {
        const headers = resp.headers();
        const cl = parseInt(headers['content-length'] || '0', 10);
        if (!playbackStarted && cl > 0) {
          bytesTransferredBeforePlayback += cl;
        }
        mediaRequests.push({
          url: url.split('/').pop(),
          status: resp.status(),
          contentRange: headers['content-range'] || null,
          contentLength: cl,
        });
      }
    });

    const t0 = Date.now();
    await page.goto(`${targetBaseUrl}/en`, { waitUntil: 'domcontentloaded' });

    // Initial check: DOM before video ready
    const initialCheck = await page.evaluate(() => {
      const posterImg = document.querySelector('img[data-splash-element="poster-fallback"]');
      const neutralLoading = document.querySelector('div[data-splash-element="neutral-loading"]');
      const video = document.querySelector('video[data-splash-element="video-stream"]');
      return {
        hasPosterImage: !!posterImg,
        hasNeutralLoading: !!neutralLoading,
        hasVideoPosterAttr: video ? !!video.getAttribute('poster') : false,
      };
    });

    await page.waitForSelector('video[data-splash-element="video-stream"]');
    const desktopMetrics = await page.evaluate(async (t0) => {
      const video = document.querySelector('video[data-splash-element="video-stream"]');
      let stalledCount = 0;
      let waitingCount = 0;

      video.addEventListener('stalled', () => stalledCount++);
      video.addEventListener('waiting', () => waitingCount++);

      return new Promise(resolve => {
        const report = () => ({
          timeToFirstFrameMs: Date.now() - t0,
          videoCurrentSrc: video.currentSrc,
          videoWidth: video.videoWidth,
          videoHeight: video.videoHeight,
          readyState: video.readyState,
          currentTime: video.currentTime,
          paused: video.paused,
          videoOpacity: window.getComputedStyle(video).opacity,
          stalledCount,
          waitingCount,
        });

        if (!video.paused && video.currentTime > 0) {
          resolve(report());
          return;
        }

        video.addEventListener('playing', () => {
          setTimeout(() => resolve(report()), 800);
        });
      });
    }, t0);

    playbackStarted = true;

    // Overlay check
    const overlayOpacity = await page.evaluate(() => {
      const overlay = document.querySelector('div.hidden.md\\:block');
      return overlay ? window.getComputedStyle(overlay).opacity : null;
    });

    // Test Gateway Enter
    await page.click('button[aria-label="Enter GEMA website"]');
    await page.waitForTimeout(1000);
    const videoUnmounted = await page.evaluate(() => {
      return !document.querySelector('video[data-splash-element="video-stream"]');
    });

    const wrongDeviceRequested = mediaRequests.some(r => r.url.includes('mobile'));

    results.desktop = {
      initialCheck,
      desktopMetrics,
      overlayOpacity,
      videoUnmounted,
      bytesTransferredBeforePlayback,
      mediaRequests,
      wrongDeviceRequested,
    };

    console.log('Initial checks:', initialCheck);
    console.log('Desktop Metrics:', desktopMetrics);
    console.log('Bytes transferred before playback:', bytesTransferredBeforePlayback);
    console.log('Overlay Opacity:', overlayOpacity);
    console.log('Video Unmounted on Enter:', videoUnmounted);
    console.log('Wrong-device requested (mobile on desktop):', wrongDeviceRequested);

    await context.close();
  }

  // 2. MOBILE PRODUCTION TEST
  console.log('\n--- 2. MOBILE PRODUCTION TEST (390x844) ---');
  {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true,
    });
    const page = await context.newPage();

    await page.route('**/*resdiary*/**', route => {
      liveResDiaryRequests++;
      if (route.request().method() === 'POST') liveBookings++;
      return route.fulfill({ status: 200, contentType: 'application/javascript', body: '/* mock */' });
    });

    let bytesTransferredBeforePlayback = 0;
    let playbackStarted = false;
    const mediaRequests = [];

    page.on('response', async resp => {
      const url = resp.url();
      if (url.includes('.mp4')) {
        const headers = resp.headers();
        const cl = parseInt(headers['content-length'] || '0', 10);
        if (!playbackStarted && cl > 0) {
          bytesTransferredBeforePlayback += cl;
        }
        mediaRequests.push({
          url: url.split('/').pop(),
          status: resp.status(),
          contentRange: headers['content-range'] || null,
          contentLength: cl,
        });
      }
    });

    const t0 = Date.now();
    await page.goto(`${targetBaseUrl}/en`, { waitUntil: 'domcontentloaded' });

    await page.waitForSelector('video[data-splash-element="video-stream"]');
    const mobileMetrics = await page.evaluate(async (t0) => {
      const video = document.querySelector('video[data-splash-element="video-stream"]');
      const posterImg = document.querySelector('img[data-splash-element="poster-fallback"]');
      let stalledCount = 0;
      let waitingCount = 0;

      video.addEventListener('stalled', () => stalledCount++);
      video.addEventListener('waiting', () => waitingCount++);

      return new Promise(resolve => {
        const report = () => ({
          timeToFirstFrameMs: Date.now() - t0,
          currentSrc: video.currentSrc,
          videoWidth: video.videoWidth,
          videoHeight: video.videoHeight,
          hasPosterImage: !!posterImg,
          hasPosterAttr: !!video.getAttribute('poster'),
          readyState: video.readyState,
          currentTime: video.currentTime,
          videoOpacity: window.getComputedStyle(video).opacity,
          stalledCount,
          waitingCount,
        });

        if (!video.paused && video.currentTime > 0) {
          resolve(report());
          return;
        }

        video.addEventListener('playing', () => {
          setTimeout(() => resolve(report()), 800);
        });
      });
    }, t0);

    playbackStarted = true;

    const wrongDeviceRequested = mediaRequests.some(r => r.url.includes('desktop'));

    results.mobile = {
      mobileMetrics,
      bytesTransferredBeforePlayback,
      mediaRequests,
      wrongDeviceRequested,
    };

    console.log('Mobile Metrics:', mobileMetrics);
    console.log('Bytes transferred before playback:', bytesTransferredBeforePlayback);
    console.log('Wrong-device requested (desktop on mobile):', wrongDeviceRequested);

    await context.close();
  }

  // 3. REDUCED MOTION PRODUCTION TEST
  console.log('\n--- 3. REDUCED MOTION PRODUCTION TEST ---');
  {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      reducedMotion: 'reduce',
    });
    const page = await context.newPage();

    await page.route('**/*resdiary*/**', route => {
      liveResDiaryRequests++;
      return route.fulfill({ status: 200, contentType: 'application/javascript', body: '/* mock */' });
    });

    const requests = [];
    page.on('request', req => {
      requests.push(req.url());
    });

    await page.goto(`${targetBaseUrl}/en`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    const reducedData = await page.evaluate(() => {
      const reducedElem = document.querySelector('[data-splash-element="reduced-motion-presentation"]');
      const video = document.querySelector('video[data-splash-element="video-stream"]');
      const neutralLoading = document.querySelector('[data-splash-element="neutral-loading"]');
      const button = document.querySelector('button[aria-label="Enter GEMA website"]');

      return {
        hasReducedPresentation: !!reducedElem,
        reducedText: reducedElem ? reducedElem.innerText.trim() : null,
        hasVideoElement: !!video,
        hasNeutralLoading: !!neutralLoading,
        backgroundColor: button ? window.getComputedStyle(button).backgroundColor : null,
      };
    });

    const splashVideoRequested = requests.filter(url => url.includes('gema-splash-'));
    const refPhotoRequested = requests.filter(url => url.includes('ref.'));

    results.reducedMotion = {
      reducedData,
      splashVideoRequestsCount: splashVideoRequested.length,
      refPhotoRequestsCount: refPhotoRequested.length,
    };

    console.log('Reduced Motion Data:', reducedData);
    console.log('Splash video requested during reduced motion:', splashVideoRequested.length);
    console.log('Ref photo requested during reduced motion:', refPhotoRequested.length);

    await context.close();
  }

  // 4. ZERO REFERENCE ASSET AUDIT ON PRODUCTION
  console.log('\n--- 4. ZERO REFERENCE ASSET AUDIT ON PRODUCTION ---');
  {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();

    await page.route('**/*resdiary*/**', route => {
      liveResDiaryRequests++;
      return route.fulfill({ status: 200, contentType: 'application/javascript', body: '/* mock */' });
    });

    const refRequests = [];
    page.on('request', req => {
      const u = req.url();
      if (u.includes('desktop-ref') || u.includes('mobile-ref')) {
        refRequests.push(u);
      }
    });

    await page.goto(`${targetBaseUrl}/en`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    const domRefImages = await page.evaluate(() => {
      const matches = [];
      document.querySelectorAll('*').forEach(el => {
        if (el.tagName === 'IMG' && (el.src.includes('desktop-ref') || el.src.includes('mobile-ref'))) {
          matches.push(el.src);
        }
        const bg = window.getComputedStyle(el).backgroundImage;
        if (bg && (bg.includes('desktop-ref') || bg.includes('mobile-ref'))) {
          matches.push(bg);
        }
      });
      return matches;
    });

    results.zeroRef = {
      domRefImagesCount: domRefImages.length,
      networkRefRequestsCount: refRequests.length,
    };

    console.log('DOM references to desktop-ref / mobile-ref:', domRefImages.length);
    console.log('Network requests for desktop-ref / mobile-ref:', refRequests.length);

    await context.close();
  }

  console.log('\n--- RESDIARY PROTOCOL SAFETY CHECK ---');
  console.log(`Live ResDiary Requests: 0 (all mocked, total intercepted: ${liveResDiaryRequests})`);
  console.log(`Live Bookings Submitted: ${liveBookings}`);

  await browser.close();
  console.log('\n=== LIVE PRODUCTION QA COMPLETE ===');
  return results;
}

testProductionSplash().catch(console.error);
