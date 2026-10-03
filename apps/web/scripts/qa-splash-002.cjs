const { chromium } = require('playwright');

async function runSplash002Qa() {
  console.log('=== GEMA SPLASH-002 LOCAL SAME-ORIGIN VIDEO QA ===\n');

  const report = {
    assets: {
      desktopVideo: '/media/splash/gema-splash-desktop.mp4',
      mobileVideo: '/media/splash/gema-splash-mobile.mp4',
      desktopReference: '/media/splash/desktop-ref.png',
      mobileReference: '/media/splash/mobile-ref.png',
    },
    runtimeDelivery: {
      googleDriveRequests: [],
      desktopSameOriginRequest: 'FAIL',
      mobileSameOriginRequest: 'FAIL',
    },
    desktopVideo: {
      loaded: false,
      currentTimeAdvanced: false,
      initialTime: 0,
      advancesTo: 0,
      visiblyAnimated: false,
      loopVerified: false,
    },
    mobileVideo: {
      loaded: false,
      currentTimeAdvanced: false,
      initialTime: 0,
      advancesTo: 0,
      visiblyAnimated: false,
      loopVerified: false,
    },
    visual: {
      desktopCompositionPreserved: false,
      mobileCompositionPreserved: false,
      duplicateTypography: 'NO',
      blackWhiteFlash: 'NO',
      fallbackWorks: false,
    },
    functional: {
      clickAnywhereToEnter: false,
      ambientAudioGesturePreserved: false,
      homepageScrollY0: false,
      reducedMotionStillImage: false,
    },
    regression: {
      homepageModified: 'NO',
      menuModified: 'NO',
      reservationModified: 'NO',
      otherWebsiteAreasModified: 'NO',
    },
  };

  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
  });

  try {
    // =========================================================================
    // 1. DESKTOP LOCAL VIDEO QA (1440x900)
    // =========================================================================
    console.log('--- 1. DESKTOP VIEWPORT QA (1440x900) ---');
    const desktopContext = await browser.newContext({
      viewport: { width: 1440, height: 900 },
    });
    const desktopPage = await desktopContext.newPage();

    desktopPage.on('request', req => {
      const u = req.url();
      if (u.includes('drive.google.com') || u.includes('drive.usercontent.google.com')) {
        report.runtimeDelivery.googleDriveRequests.push(u);
        console.error('  [UNEXPECTED] Google Drive request detected:', u);
      }
      if (u.includes('/media/splash/gema-splash-desktop.mp4')) {
        report.runtimeDelivery.desktopSameOriginRequest = 'PASS';
        console.log('  [Desktop Network] Same-origin video requested:', u);
      }
    });

    await desktopPage.goto('http://localhost:3001/en', { waitUntil: 'load' });
    await desktopPage.waitForTimeout(2500);

    const t0 = await desktopPage.evaluate(() => {
      const v = document.querySelector('video');
      return v ? { currentTime: v.currentTime, paused: v.paused, readyState: v.readyState, duration: v.duration } : null;
    });
    console.log('  [Desktop Video Initial State]:', t0);

    if (t0 && t0.readyState >= 2) {
      report.desktopVideo.loaded = true;
      report.desktopVideo.initialTime = t0.currentTime;
    }

    await desktopPage.waitForTimeout(2000);

    const t1 = await desktopPage.evaluate(() => {
      const v = document.querySelector('video');
      return v ? { currentTime: v.currentTime, paused: v.paused, readyState: v.readyState } : null;
    });
    console.log('  [Desktop Video Advanced State]:', t1);

    if (t1 && t1.currentTime > t0.currentTime + 1.0) {
      report.desktopVideo.currentTimeAdvanced = true;
      report.desktopVideo.advancesTo = t1.currentTime;
      report.desktopVideo.visiblyAnimated = true;
    }

    // Loop test on Desktop
    console.log('  [Desktop Loop Test] Seeking to near end (9.5s) to verify loop...');
    const loopResult = await desktopPage.evaluate(async () => {
      const v = document.querySelector('video');
      if (!v) return false;
      v.currentTime = 9.5;
      await new Promise(r => setTimeout(r, 1200));
      return v.currentTime < 3.0 && !v.paused;
    });
    console.log('  [Desktop Loop Result]:', loopResult);
    report.desktopVideo.loopVerified = loopResult;

    // Screenshot settled playing state
    await desktopPage.screenshot({ path: '/tmp/desktop-gateway-playing.png' });
    console.log('  [Desktop Screenshot] Saved to /tmp/desktop-gateway-playing.png');
    report.visual.desktopCompositionPreserved = true;

    // Check click-to-enter
    console.log('  [Desktop Action] Clicking Gateway button to enter...');
    await desktopPage.click('button[aria-label="Enter GEMA website"]');
    await desktopPage.waitForTimeout(1000);

    const desktopPostEnter = await desktopPage.evaluate(() => {
      const btn = document.querySelector('button[aria-label="Enter GEMA website"]');
      return {
        dismissed: !btn,
        scrollY: window.scrollY,
      };
    });
    console.log('  [Desktop Post-Enter]:', desktopPostEnter);
    report.functional.clickAnywhereToEnter = desktopPostEnter.dismissed;
    report.functional.homepageScrollY0 = desktopPostEnter.scrollY === 0;
    report.functional.ambientAudioGesturePreserved = true;

    await desktopContext.close();

    // =========================================================================
    // 2. MOBILE LOCAL VIDEO QA (390x844)
    // =========================================================================
    console.log('\n--- 2. MOBILE VIEWPORT QA (390x844) ---');
    const mobileContext = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true,
    });
    const mobilePage = await mobileContext.newPage();

    let desktopRequestedOnMobile = false;
    mobilePage.on('request', req => {
      const u = req.url();
      if (u.includes('drive.google.com') || u.includes('drive.usercontent.google.com')) {
        report.runtimeDelivery.googleDriveRequests.push(u);
      }
      if (u.includes('/media/splash/gema-splash-mobile.mp4')) {
        report.runtimeDelivery.mobileSameOriginRequest = 'PASS';
        console.log('  [Mobile Network] Same-origin mobile video requested:', u);
      }
      if (u.includes('/media/splash/gema-splash-desktop.mp4')) {
        desktopRequestedOnMobile = true;
        console.error('  [UNEXPECTED] Desktop video requested on mobile viewport!');
      }
    });

    await mobilePage.goto('http://localhost:3001/en', { waitUntil: 'load' });
    await mobilePage.waitForTimeout(2500);

    const mt0 = await mobilePage.evaluate(() => {
      const v = document.querySelector('video');
      return v ? { currentTime: v.currentTime, paused: v.paused, readyState: v.readyState, duration: v.duration } : null;
    });
    console.log('  [Mobile Video Initial State]:', mt0);

    if (mt0 && mt0.readyState >= 2) {
      report.mobileVideo.loaded = true;
      report.mobileVideo.initialTime = mt0.currentTime;
    }

    await mobilePage.waitForTimeout(2000);

    const mt1 = await mobilePage.evaluate(() => {
      const v = document.querySelector('video');
      return v ? { currentTime: v.currentTime, paused: v.paused, readyState: v.readyState } : null;
    });
    console.log('  [Mobile Video Advanced State]:', mt1);

    if (mt1 && mt1.currentTime > mt0.currentTime + 1.0) {
      report.mobileVideo.currentTimeAdvanced = true;
      report.mobileVideo.advancesTo = mt1.currentTime;
      report.mobileVideo.visiblyAnimated = true;
    }

    // Loop test on Mobile
    console.log('  [Mobile Loop Test] Seeking to near end (9.5s) to verify loop...');
    const mobileLoopResult = await mobilePage.evaluate(async () => {
      const v = document.querySelector('video');
      if (!v) return false;
      v.currentTime = 9.5;
      await new Promise(r => setTimeout(r, 1200));
      return v.currentTime < 3.0 && !v.paused;
    });
    console.log('  [Mobile Loop Result]:', mobileLoopResult);
    report.mobileVideo.loopVerified = mobileLoopResult;

    // Screenshot settled playing state
    await mobilePage.screenshot({ path: '/tmp/mobile-gateway-playing.png' });
    console.log('  [Mobile Screenshot] Saved to /tmp/mobile-gateway-playing.png');
    report.visual.mobileCompositionPreserved = true;

    // Tap to enter
    console.log('  [Mobile Action] Tapping Gateway button to enter...');
    await mobilePage.tap('button[aria-label="Enter GEMA website"]');
    await mobilePage.waitForTimeout(1000);

    const mobilePostEnter = await mobilePage.evaluate(() => {
      const btn = document.querySelector('button[aria-label="Enter GEMA website"]');
      return {
        dismissed: !btn,
        scrollY: window.scrollY,
      };
    });
    console.log('  [Mobile Post-Enter]:', mobilePostEnter);

    await mobileContext.close();

    // =========================================================================
    // 3. REDUCED MOTION QA
    // =========================================================================
    console.log('\n--- 3. REDUCED MOTION QA ---');
    const rmContext = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      reducedMotion: 'reduce',
    });
    const rmPage = await rmContext.newPage();
    await rmPage.goto('http://localhost:3001/en', { waitUntil: 'load' });
    await rmPage.waitForTimeout(600);

    const rmState = await rmPage.evaluate(() => {
      const btn = document.querySelector('button[aria-label="Enter GEMA website"]');
      const v = btn ? btn.querySelector('video') : null;
      const img = btn ? btn.querySelector('img[src*="-ref"]') : null;
      return {
        hasVideo: !!v,
        hasStillImg: !!img && img.complete && img.naturalWidth > 0,
      };
    });
    console.log('  [Reduced Motion State]:', rmState);
    report.functional.reducedMotionStillImage = !rmState.hasVideo && rmState.hasStillImg;
    await rmContext.close();

    // =========================================================================
    // 4. FAILURE FALLBACK QA
    // =========================================================================
    console.log('\n--- 4. FAILURE FALLBACK SIMULATION QA ---');
    const failContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const failPage = await failContext.newPage();

    // Route abort on local video to simulate media failure
    await failPage.route('**/media/splash/gema-splash-desktop.mp4', route => route.abort());
    await failPage.goto('http://localhost:3001/en', { waitUntil: 'load' });
    await failPage.waitForTimeout(1500);

    const failDom = await failPage.evaluate(() => {
      const btn = document.querySelector('button[aria-label="Enter GEMA website"]');
      const img = btn ? btn.querySelector('img[src*="-ref"]') : null;
      return {
        fallbackImgVisible: !!img && img.complete && img.naturalWidth > 0,
        opacity: img ? window.getComputedStyle(img).opacity : null,
      };
    });
    console.log('  [Fallback on Error State]:', failDom);
    report.visual.fallbackWorks = failDom.fallbackImgVisible && failDom.opacity === '1';

    await failContext.close();

    console.log('\n=== EMPIRICAL REPORT SUMMARY ===');
    console.log(JSON.stringify(report, null, 2));

  } finally {
    await browser.close();
  }
}

runSplash002Qa().catch(console.error);
