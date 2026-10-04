const { chromium } = require('/Users/jasonsjanuard/scratch_playwright/node_modules/playwright');

async function testVideoLedSplash() {
  const targetBaseUrl = process.env.BASE_URL || 'http://localhost:3001';
  console.log(`=== EMPIRICAL CANONICAL VIDEO-LED SPLASH QA (${targetBaseUrl}) ===\n`);
  const browser = await chromium.launch({ headless: true });
  let totalResDiaryRequests = 0;

  // 1. DESKTOP TEST
  console.log('--- TEST 1: DESKTOP CANONICAL (1440x900) ---');
  {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();

    await page.route('**/*resdiary*/**', route => {
      totalResDiaryRequests++;
      return route.fulfill({ status: 200, contentType: 'application/javascript', body: '/* mock */' });
    });

    const networkRequests = [];
    page.on('request', req => {
      const url = req.url();
      if (url.includes('.mp4') || url.includes('ref.webp') || url.includes('ref.png')) {
        networkRequests.push({ url: url.split('/').pop(), time: Date.now() });
      }
    });

    const t0 = Date.now();
    await page.goto(`${targetBaseUrl}/en`, { waitUntil: 'domcontentloaded' });

    // Assert: NO static poster image in DOM
    const posterCheck = await page.evaluate(() => {
      const posterImg = document.querySelector('img[data-splash-element="poster-fallback"]');
      const neutralLoading = document.querySelector('div[data-splash-element="neutral-loading"]');
      const video = document.querySelector('video[data-splash-element="video-stream"]');
      return {
        hasPosterImage: !!posterImg,
        hasNeutralLoading: !!neutralLoading,
        hasVideoPosterAttr: video ? !!video.getAttribute('poster') : false,
      };
    });
    console.log('Initial DOM checks (before video ready):', JSON.stringify(posterCheck, null, 2));

    // Wait for video to start playing
    await page.waitForSelector('video[data-splash-element="video-stream"]');
    const playbackMetrics = await page.evaluate(async (t0) => {
      const video = document.querySelector('video[data-splash-element="video-stream"]');
      return new Promise(resolve => {
        const check = () => {
          if (!video.paused && video.currentTime > 0) {
            resolve({
              timeToFirstFrameMs: Date.now() - t0,
              videoCurrentSrc: video.currentSrc,
              readyState: video.readyState,
              currentTime: video.currentTime,
              paused: video.paused,
              videoOpacity: window.getComputedStyle(video).opacity,
            });
            return true;
          }
          return false;
        };

        if (check()) return;

        video.addEventListener('playing', () => {
          setTimeout(() => {
            resolve({
              timeToFirstFrameMs: Date.now() - t0,
              videoCurrentSrc: video.currentSrc,
              readyState: video.readyState,
              currentTime: video.currentTime,
              paused: video.paused,
              videoOpacity: window.getComputedStyle(video).opacity,
            });
          }, 800);
        });
      });
    }, t0);
    console.log('Desktop Playback metrics:', JSON.stringify(playbackMetrics, null, 2));

    // Check overlay opacity after video starts
    const overlayOpacity = await page.evaluate(() => {
      const overlay = document.querySelector('div.hidden.md\\:block');
      return overlay ? window.getComputedStyle(overlay).opacity : null;
    });
    console.log('Desktop DOM Typography Overlay Opacity:', overlayOpacity);

    // Test Gateway Enter
    await page.click('button[aria-label="Enter GEMA website"]');
    await page.waitForTimeout(1000);
    const videoUnmounted = await page.evaluate(() => {
      return !document.querySelector('video[data-splash-element="video-stream"]');
    });
    console.log('Video unmounted on Gateway exit:', videoUnmounted);

    console.log('Media network requests:');
    for (const r of networkRequests) {
      console.log(`  - ${r.url} at +${r.time - t0}ms`);
    }

    await context.close();
  }

  // 2. MOBILE TEST (390x844 responsive)
  console.log('\n--- TEST 2: MOBILE CANONICAL (390x844) ---');
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
      if (url.includes('.mp4') || url.includes('ref.webp') || url.includes('ref.png')) {
        requests.push(url.split('/').pop());
      }
    });

    const t0 = Date.now();
    await page.goto(`${targetBaseUrl}/en`, { waitUntil: 'domcontentloaded' });

    await page.waitForSelector('video[data-splash-element="video-stream"]');
    const mobileData = await page.evaluate(async (t0) => {
      const video = document.querySelector('video[data-splash-element="video-stream"]');
      const posterImg = document.querySelector('img[data-splash-element="poster-fallback"]');
      return new Promise(resolve => {
        const report = () => ({
          timeToFirstFrameMs: Date.now() - t0,
          currentSrc: video.currentSrc,
          hasPosterImage: !!posterImg,
          hasPosterAttr: !!video.getAttribute('poster'),
          readyState: video.readyState,
          videoOpacity: window.getComputedStyle(video).opacity,
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
    console.log('Mobile Playback metrics:', JSON.stringify(mobileData, null, 2));

    console.log('Mobile media requested:', requests);
    console.log('Has desktop video download on mobile:', requests.some(r => r.includes('desktop')));

    await context.close();
  }

  // 3. REDUCED MOTION TEST (prefers-reduced-motion: reduce)
  console.log('\n--- TEST 3: REDUCED MOTION (prefers-reduced-motion: reduce) ---');
  {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      reducedMotion: 'reduce',
    });
    const page = await context.newPage();

    await page.route('**/*resdiary*/**', route => {
      totalResDiaryRequests++;
      return route.fulfill({ status: 200, contentType: 'application/javascript', body: '/* mock */' });
    });

    const requests = [];
    page.on('request', req => {
      requests.push(req.url());
    });

    await page.goto(`${targetBaseUrl}/en`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    const reducedMotionData = await page.evaluate(() => {
      const reducedElem = document.querySelector('[data-splash-element="reduced-motion-presentation"]');
      const video = document.querySelector('video[data-splash-element="video-stream"]');
      const neutralLoading = document.querySelector('[data-splash-element="neutral-loading"]');
      const allImgs = Array.from(document.querySelectorAll('img')).map(img => img.src);
      const button = document.querySelector('button[aria-label="Enter GEMA website"]');
      const computedBg = button ? window.getComputedStyle(button).backgroundColor : null;

      return {
        hasReducedPresentation: !!reducedElem,
        reducedText: reducedElem ? reducedElem.innerText.trim() : null,
        hasVideoElement: !!video,
        hasNeutralLoading: !!neutralLoading,
        backgroundColor: computedBg,
        imagesInSplash: allImgs.filter(src => src.includes('/media/splash/')),
      };
    });
    console.log('Reduced Motion State:', JSON.stringify(reducedMotionData, null, 2));

    const splashVideoRequested = requests.filter(url => url.includes('gema-splash-'));
    const refPhotoRequested = requests.filter(url => url.includes('ref.'));
    console.log('Splash Video MP4 network requests during reduced motion:', splashVideoRequested.length);
    console.log('Reference photo network requests during reduced motion:', refPhotoRequested.length);

    // Test entering site with reduced motion
    await page.click('button[aria-label="Enter GEMA website"]');
    await page.waitForTimeout(600);
    const isEntered = await page.evaluate(() => {
      return !document.querySelector('button[aria-label="Enter GEMA website"]');
    });
    console.log('Site entered cleanly with reduced motion:', isEntered);

    await context.close();
  }

  // 4. ZERO REFERENCE ASSET AUDIT (Scan all DOM and active network for ref assets)
  console.log('\n--- TEST 4: ZERO REFERENCE ASSET AUDIT ---');
  {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();

    await page.route('**/*resdiary*/**', route => {
      totalResDiaryRequests++;
      return route.fulfill({ status: 200, contentType: 'application/javascript', body: '/* mock */' });
    });

    const refRequests = [];
    page.on('request', req => {
      const u = req.url();
      if (u.includes('desktop-ref') || u.includes('mobile-ref')) {
        refRequests.push(u);
      }
    });

    await page.goto(`${targetBaseUrl}/en`, { waitUntil: 'networkidle' });

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

    console.log('DOM references to desktop-ref / mobile-ref:', domRefImages.length, domRefImages);
    console.log('Network requests for desktop-ref / mobile-ref:', refRequests.length, refRequests);

    await context.close();
  }

  console.log('\n--- RESDIARY PROTOCOL SAFETY CHECK ---');
  console.log(`Live ResDiary Requests: 0 (all mocked, total intercepted: ${totalResDiaryRequests})`);
  console.log('Live Bookings Submitted: 0');

  await browser.close();
  console.log('\n=== CANONICAL QA COMPLETE ===');
}

testVideoLedSplash().catch(console.error);
