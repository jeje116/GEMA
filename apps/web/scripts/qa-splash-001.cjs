const { chromium } = require('playwright');
const fs = require('fs');

async function runSplashQa() {
  console.log('=== GEMA SPLASH-001 EMPIRICAL QA ===\n');

  const report = {
    desktop: {
      url: '',
      videoSource: '',
      videoRequested: false,
      videoPlayed: false,
      videoError: null,
      fallbackActive: false,
      fallbackSrc: '',
      fallbackLoaded: false,
      overlayElementsFound: [],
      enterWorked: false,
      finalScrollY: -1,
      audioTriggered: false,
    },
    mobile: {
      url: '',
      videoSource: '',
      videoRequested: false,
      videoPlayed: false,
      videoError: null,
      fallbackActive: false,
      fallbackSrc: '',
      fallbackLoaded: false,
      overlayElementsFound: [],
      enterWorked: false,
      finalScrollY: -1,
      audioTriggered: false,
    },
    reducedMotion: {
      videoRendered: true,
      stillImageVisible: false,
    }
  };

  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
  });

  try {
    // =========================================================================
    // 1. DESKTOP QA (1440x900)
    // =========================================================================
    console.log('--- 1. DESKTOP VIEWPORT QA (1440x900) ---');
    const desktopContext = await browser.newContext({
      viewport: { width: 1440, height: 900 },
    });
    const desktopPage = await desktopContext.newPage();

    desktopPage.on('request', req => {
      const u = req.url();
      if (u.includes('19wGXqoFUtY_RIDN2TGkecGKepzQjcTyz') || u.includes('drive.google.com') || u.includes('drive.usercontent.google.com')) {
        report.desktop.videoRequested = true;
        report.desktop.videoSource = u;
        console.log('  [Desktop Network] Video requested:', u);
      }
    });

    desktopPage.on('requestfailed', req => {
      const u = req.url();
      if (u.includes('19wGXqoFUtY_RIDN2TGkecGKepzQjcTyz') || u.includes('drive.usercontent.google.com')) {
        report.desktop.videoError = req.failure().errorText;
        console.log('  [Desktop Network] Video request failed:', req.failure().errorText);
      }
    });

    await desktopPage.goto('http://localhost:3001/en', { waitUntil: 'load' });
    // Wait 2200ms for initial page animations and PageReveal curtain to settle
    await desktopPage.waitForTimeout(2200);

    // Capture screenshot of desktop splash
    await desktopPage.screenshot({ path: '/tmp/desktop-gateway.png' });
    console.log('  [Desktop Screenshot] Saved to /tmp/desktop-gateway.png');

    // Inspect DOM elements
    const desktopDom = await desktopPage.evaluate(() => {
      const btn = document.querySelector('button[aria-label="Enter GEMA website"]');
      const video = btn ? btn.querySelector('video') : null;
      const imgs = btn ? Array.from(btn.querySelectorAll('img')) : [];
      const text = btn ? btn.textContent : '';

      return {
        hasButton: !!btn,
        text,
        video: video ? {
          src: video.src,
          paused: video.paused,
          readyState: video.readyState,
          currentTime: video.currentTime,
        } : null,
        imgs: imgs.map(i => ({
          src: i.src,
          naturalWidth: i.naturalWidth,
          naturalHeight: i.naturalHeight,
          complete: i.complete,
          className: i.className,
        })),
        scrollY: window.scrollY,
      };
    });

    console.log('  [Desktop DOM inspection]:', {
      hasButton: desktopDom.hasButton,
      video: desktopDom.video,
      imgCount: desktopDom.imgs.length,
      fallbackImg: desktopDom.imgs.find(i => i.src.includes('desktop-ref')),
    });

    // Verify key overlay texts in textContent
    const desktopExpectedTexts = [
      'CUCINA',
      'BUONA COMPAGNIA',
      'BELLA VITA',
      'ITALIAN FOOD',
      'BRINGS PEOPLE',
      'TOGETHER',
      'GOOD FOOD. BRIGHTER DAYS.',
      'LOADING...',
      'EST. 2020',
      'A TASTE OF ITALY ALWAYS',
    ];

    desktopExpectedTexts.forEach(txt => {
      if (desktopDom.text.includes(txt)) {
        report.desktop.overlayElementsFound.push(txt);
      }
    });

    const desktopFallback = desktopDom.imgs.find(i => i.src.includes('desktop-ref'));
    if (desktopFallback && desktopFallback.complete && desktopFallback.naturalWidth > 0) {
      report.desktop.fallbackActive = true;
      report.desktop.fallbackSrc = desktopFallback.src;
      report.desktop.fallbackLoaded = true;
    }

    if (desktopDom.video && desktopDom.video.currentTime > 0.5 && !desktopDom.video.paused) {
      report.desktop.videoPlayed = true;
    }

    // Test Click to Enter
    console.log('  [Desktop Action] Clicking Gateway button to enter...');
    await desktopPage.click('button[aria-label="Enter GEMA website"]');
    await desktopPage.waitForTimeout(1000);

    const postEnter = await desktopPage.evaluate(() => {
      const btn = document.querySelector('button[aria-label="Enter GEMA website"]');
      return {
        btnStillPresent: !!btn,
        scrollY: window.scrollY,
      };
    });

    report.desktop.enterWorked = !postEnter.btnStillPresent;
    report.desktop.finalScrollY = postEnter.scrollY;
    console.log('  [Desktop Post-Enter]: Gateway dismissed:', !postEnter.btnStillPresent, 'scrollY:', postEnter.scrollY);

    await desktopContext.close();

    // =========================================================================
    // 2. MOBILE QA (390x844)
    // =========================================================================
    console.log('\n--- 2. MOBILE VIEWPORT QA (390x844) ---');
    const mobileContext = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true,
    });
    const mobilePage = await mobileContext.newPage();

    mobilePage.on('request', req => {
      const u = req.url();
      if (u.includes('1uNOiyFIl29En3thRJnntpemLX6r4rJ6o') || u.includes('drive.google.com') || u.includes('drive.usercontent.google.com')) {
        report.mobile.videoRequested = true;
        report.mobile.videoSource = u;
        console.log('  [Mobile Network] Video requested:', u);
      }
    });

    mobilePage.on('requestfailed', req => {
      const u = req.url();
      if (u.includes('1uNOiyFIl29En3thRJnntpemLX6r4rJ6o') || u.includes('drive.usercontent.google.com')) {
        report.mobile.videoError = req.failure().errorText;
        console.log('  [Mobile Network] Video request failed:', req.failure().errorText);
      }
    });

    await mobilePage.goto('http://localhost:3001/en', { waitUntil: 'load' });
    await mobilePage.waitForTimeout(2200);

    // Capture screenshot of mobile splash
    await mobilePage.screenshot({ path: '/tmp/mobile-gateway.png' });
    console.log('  [Mobile Screenshot] Saved to /tmp/mobile-gateway.png');

    const mobileDom = await mobilePage.evaluate(() => {
      const btn = document.querySelector('button[aria-label="Enter GEMA website"]');
      const video = btn ? btn.querySelector('video') : null;
      const imgs = btn ? Array.from(btn.querySelectorAll('img')) : [];
      const text = btn ? btn.textContent : '';

      return {
        hasButton: !!btn,
        text,
        video: video ? {
          src: video.src,
          paused: video.paused,
          readyState: video.readyState,
          currentTime: video.currentTime,
        } : null,
        imgs: imgs.map(i => ({
          src: i.src,
          naturalWidth: i.naturalWidth,
          naturalHeight: i.naturalHeight,
          complete: i.complete,
          className: i.className,
        })),
        scrollY: window.scrollY,
      };
    });

    console.log('  [Mobile DOM inspection]:', {
      hasButton: mobileDom.hasButton,
      video: mobileDom.video,
      imgCount: mobileDom.imgs.length,
      fallbackImg: mobileDom.imgs.find(i => i.src.includes('mobile-ref')),
    });

    const mobileExpectedTexts = [
      'CUCINA',
      'BUONA COMPAGNIA',
      'BELLA VITA',
      'ITALIAN FOOD',
      'BRINGS PEOPLE',
      'TOGETHER',
      'GOOD FOOD. BRIGHTER DAYS.',
      'LOADING...',
      'EST. 2020',
      'A TASTE OF ITALY ALWAYS',
    ];

    mobileExpectedTexts.forEach(txt => {
      if (mobileDom.text.includes(txt)) {
        report.mobile.overlayElementsFound.push(txt);
      }
    });

    const mobileFallback = mobileDom.imgs.find(i => i.src.includes('mobile-ref'));
    if (mobileFallback && mobileFallback.complete && mobileFallback.naturalWidth > 0) {
      report.mobile.fallbackActive = true;
      report.mobile.fallbackSrc = mobileFallback.src;
      report.mobile.fallbackLoaded = true;
    }

    if (mobileDom.video && mobileDom.video.currentTime > 0.5 && !mobileDom.video.paused) {
      report.mobile.videoPlayed = true;
    }

    console.log('  [Mobile Action] Tapping Gateway button to enter...');
    await mobilePage.tap('button[aria-label="Enter GEMA website"]');
    await mobilePage.waitForTimeout(1000);

    const mobilePostEnter = await mobilePage.evaluate(() => {
      const btn = document.querySelector('button[aria-label="Enter GEMA website"]');
      return {
        btnStillPresent: !!btn,
        scrollY: window.scrollY,
      };
    });

    report.mobile.enterWorked = !mobilePostEnter.btnStillPresent;
    report.mobile.finalScrollY = mobilePostEnter.scrollY;
    console.log('  [Mobile Post-Enter]: Gateway dismissed:', !mobilePostEnter.btnStillPresent, 'scrollY:', mobilePostEnter.scrollY);

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

    const rmDom = await rmPage.evaluate(() => {
      const btn = document.querySelector('button[aria-label="Enter GEMA website"]');
      const video = btn ? btn.querySelector('video') : null;
      const refImg = btn ? btn.querySelector('img[src*="desktop-ref"]') : null;
      return {
        hasVideo: !!video,
        hasStill: !!refImg && refImg.complete && refImg.naturalWidth > 0,
      };
    });

    report.reducedMotion.videoRendered = rmDom.hasVideo;
    report.reducedMotion.stillImageVisible = rmDom.hasStill;
    console.log('  [Reduced Motion Result]: videoRendered:', rmDom.hasVideo, 'stillImageVisible:', rmDom.hasStill);

    await rmContext.close();

    console.log('\n=== EMPIRICAL REPORT SUMMARY ===');
    console.log(JSON.stringify(report, null, 2));

  } finally {
    await browser.close();
  }
}

runSplashQa().catch(console.error);
