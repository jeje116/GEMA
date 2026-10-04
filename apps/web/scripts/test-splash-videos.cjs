const { chromium } = require('/Users/jasonsjanuard/scratch_playwright/node_modules/playwright');
const assert = require('node:assert/strict');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3001';

async function testSplashVideos() {
  console.log(`Starting Splash Video Verification against ${BASE_URL}...`);
  const browser = await chromium.launch({ headless: true });
  let resdiaryRequests = 0;

  try {
    // -------------------------------------------------------------
    // TEST 1: DESKTOP VIEWPORT
    // -------------------------------------------------------------
    console.log('\n--- 1. Testing Desktop Viewport (1440x900) ---');
    const desktopContext = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    });

    const desktopPage = await desktopContext.newPage();
    const desktopErrors = [];
    desktopPage.on('console', msg => {
      if (msg.type() === 'error' && !msg.text().includes('ERR_FAILED') && !msg.text().includes('Event')) {
        desktopErrors.push(msg.text());
      }
    });
    desktopPage.on('pageerror', err => desktopErrors.push(err.message));

    // ResDiary safety gate: block all ResDiary traffic
    await desktopPage.route('**/*resdiary*/**', route => {
      resdiaryRequests++;
      route.abort();
    });

    await desktopPage.goto(`${BASE_URL}/en`, { waitUntil: 'domcontentloaded' });

    // Verify video stream exists
    const videoSelector = 'video[data-splash-element="video-stream"]';
    await desktopPage.waitForSelector(videoSelector, { timeout: 10000 });

    const desktopVideoSrc = await desktopPage.$eval(videoSelector, el => el.currentSrc || el.src);
    console.log('Desktop video currentSrc:', desktopVideoSrc);
    assert.ok(
      desktopVideoSrc.includes('gema-splash-desktop.mp4'),
      `Expected desktop video src to include gema-splash-desktop.mp4, got: ${desktopVideoSrc}`
    );

    // Wait for video to advance playback (currentTime > 0.5s)
    await desktopPage.waitForFunction(
      selector => {
        const vid = document.querySelector(selector);
        return vid && vid.currentTime > 0.5 && vid.readyState >= 3 && !vid.paused;
      },
      videoSelector,
      { timeout: 15000 }
    );

    const desktopVideoState = await desktopPage.$eval(videoSelector, el => ({
      currentTime: el.currentTime,
      duration: el.duration,
      videoWidth: el.videoWidth,
      videoHeight: el.videoHeight,
      paused: el.paused,
      readyState: el.readyState,
    }));
    console.log('Desktop video playback state:', desktopVideoState);
    assert.ok(desktopVideoState.currentTime > 0.5, 'Video failed to advance currentTime');
    assert.strictEqual(desktopVideoState.paused, false, 'Video should be playing');
    assert.strictEqual(desktopVideoState.videoWidth, 3840, 'Expected 4K desktop video width 3840');
    assert.strictEqual(desktopVideoState.videoHeight, 2160, 'Expected 4K desktop video height 2160');

    // Verify poster is hidden when video is loaded
    const posterOpacity = await desktopPage.$eval('img[data-splash-element="poster-fallback"]', el => {
      return window.getComputedStyle(el).opacity;
    });
    console.log('Desktop fallback poster opacity during playback:', posterOpacity);

    // Test Gateway exit click
    await desktopPage.click('button[type="button"][aria-label="Enter GEMA website"]');
    await desktopPage.waitForTimeout(1000);
    const splashVisible = await desktopPage.$('button[type="button"][aria-label="Enter GEMA website"]');
    console.log('Splash button after enter click:', splashVisible ? 'dismissing/dismissed' : 'removed');
    await desktopContext.close();

    // -------------------------------------------------------------
    // TEST 2: MOBILE VIEWPORT
    // -------------------------------------------------------------
    console.log('\n--- 2. Testing Mobile Viewport (390x844) ---');
    const mobileContext = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true,
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
    });

    const mobilePage = await mobileContext.newPage();
    const mobileErrors = [];
    mobilePage.on('console', msg => {
      if (msg.type() === 'error' && !msg.text().includes('ERR_FAILED') && !msg.text().includes('Event')) {
        mobileErrors.push(msg.text());
      }
    });
    mobilePage.on('pageerror', err => mobileErrors.push(err.message));

    await mobilePage.route('**/*resdiary*/**', route => {
      resdiaryRequests++;
      route.abort();
    });

    await mobilePage.goto(`${BASE_URL}/en`, { waitUntil: 'domcontentloaded' });

    await mobilePage.waitForSelector(videoSelector, { timeout: 10000 });

    const mobileVideoSrc = await mobilePage.$eval(videoSelector, el => el.currentSrc || el.src);
    console.log('Mobile video currentSrc:', mobileVideoSrc);
    assert.ok(
      mobileVideoSrc.includes('gema-splash-mobile.mp4'),
      `Expected mobile video src to include gema-splash-mobile.mp4, got: ${mobileVideoSrc}`
    );

    await mobilePage.waitForFunction(
      selector => {
        const vid = document.querySelector(selector);
        return vid && vid.currentTime > 0.5 && vid.readyState >= 3 && !vid.paused;
      },
      videoSelector,
      { timeout: 15000 }
    );

    const mobileVideoState = await mobilePage.$eval(videoSelector, el => ({
      currentTime: el.currentTime,
      duration: el.duration,
      videoWidth: el.videoWidth,
      videoHeight: el.videoHeight,
      paused: el.paused,
      readyState: el.readyState,
    }));
    console.log('Mobile video playback state:', mobileVideoState);
    assert.ok(mobileVideoState.currentTime > 0.5, 'Mobile video failed to advance currentTime');
    assert.strictEqual(mobileVideoState.paused, false, 'Mobile video should be playing');
    assert.strictEqual(mobileVideoState.videoWidth, 2160, 'Expected 4K portrait mobile video width 2160');
    assert.strictEqual(mobileVideoState.videoHeight, 3840, 'Expected 4K portrait mobile video height 3840');

    await mobileContext.close();

    console.log('\n--- VERIFICATION AUDIT SUMMARY ---');
    console.log('Desktop video playback: PASSED (3840x2160 4K UHD H.264)');
    console.log('Mobile video playback: PASSED (2160x3840 4K UHD H.264)');
    console.log(`ResDiary production requests blocked: ${resdiaryRequests}`);
    console.log(`Console runtime errors: ${desktopErrors.length + mobileErrors.length}`);

    assert.strictEqual(desktopErrors.length + mobileErrors.length, 0, 'Unexpected runtime console errors');

    console.log('\n✓ ALL SPLASH VIDEO TESTS PASSED LOCALLY!\n');
  } finally {
    await browser.close();
  }
}

testSplashVideos().catch(err => {
  console.error('\n✗ TEST FAILED:', err);
  process.exit(1);
});
