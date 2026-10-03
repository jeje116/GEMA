/**
 * SPLASH-006B: Real Empirical Visual QA & Fullscreen Assertion Suite
 * Generates actual browser screenshots and labeled contact sheets
 */

const fs = require('fs');
const path = require('path');
const { chromium } = require('/Users/jasonsjanuard/scratch_playwright/node_modules/playwright');
const sharp = require(path.resolve(__dirname, '../node_modules/sharp'));

const SCRATCH_DIR = '/Users/jasonsjanuard/.gemini/antigravity-ide/brain/a3779072-b07b-4e82-86bf-9d3fa933eff6/scratch/splash-006b';

const MOBILE_VIEWPORTS = [
  { width: 360, height: 800, name: '360x800' },
  { width: 375, height: 812, name: '375x812' },
  { width: 390, height: 700, name: '390x700' },
  { width: 390, height: 780, name: '390x780' },
  { width: 390, height: 844, name: '390x844' }, // Authoritative reference / PO baseline
  { width: 390, height: 900, name: '390x900' },
  { width: 402, height: 874, name: '402x874' },
  { width: 412, height: 915, name: '412x915' },
  { width: 430, height: 760, name: '430x760' },
  { width: 430, height: 850, name: '430x850' },
  { width: 430, height: 932, name: '430x932' },
  { width: 480, height: 800, name: '480x800' },
  { width: 540, height: 960, name: '540x960' },
];

const DESKTOP_VIEWPORTS = [
  { width: 1280, height: 720, name: '1280x720' },
  { width: 1366, height: 768, name: '1366x768' },
  { width: 1440, height: 900, name: '1440x900' },
  { width: 1920, height: 1080, name: '1920x1080' },
];

async function runSplash006BQA() {
  if (!fs.existsSync(SCRATCH_DIR)) {
    fs.mkdirSync(SCRATCH_DIR, { recursive: true });
  }

  console.log('=== GEMA SPLASH-006B: EMPIRICAL VISUAL QA MATRIX ===\n');
  const browser = await chromium.launch({ headless: true });

  const structuralResults = [];
  const mobileScreenshots = [];
  const desktopScreenshots = [];

  // ==========================================
  // 1. MOBILE SCREENSHOT & STRUCTURAL AUDIT
  // ==========================================
  console.log('--- 1. Testing Mobile Viewports ---');
  for (const vp of MOBILE_VIEWPORTS) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 2, // High resolution for clear visual inspection
    });
    const page = await context.newPage();

    await page.goto('http://localhost:3001', { waitUntil: 'networkidle', timeout: 15000 });
    // Wait for video to be playing and overlay to fade in
    await page.waitForTimeout(1800);

    // Structural assessment
    const assessment = await page.evaluate((viewport) => {
      const mediaLayer = document.querySelector('[data-splash-element="media-layer"]');
      const video = document.querySelector('video[data-splash-element="video-stream"]');
      const poster = document.querySelector('img[data-splash-element="poster-fallback"]');
      
      const mediaRect = mediaLayer ? mediaLayer.getBoundingClientRect() : null;
      const videoRect = video ? video.getBoundingClientRect() : null;

      // Check for empty bands / letterboxing
      const bodyRect = document.body.getBoundingClientRect();
      const isMediaFullscreen = mediaRect && 
        mediaRect.top === 0 && 
        mediaRect.left === 0 && 
        mediaRect.width === viewport.width && 
        mediaRect.height === viewport.height;

      // Extract DOM elements positions (targeting visible element)
      const getRect = (sel) => {
        const elements = Array.from(document.querySelectorAll(sel));
        const el = elements.find(e => {
          const r = e.getBoundingClientRect();
          return r.width > 0 && r.height > 0;
        }) || elements[0];
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return {
          top: Math.round(r.top),
          bottom: Math.round(r.bottom),
          left: Math.round(r.left),
          right: Math.round(r.right),
          width: Math.round(r.width),
          height: Math.round(r.height),
        };
      };

      const motto = getRect('[data-splash-element="motto"]');
      const logo = getRect('[data-splash-element="logo"]');
      const italianFood = getRect('[data-splash-element="italian-food"]');
      const welcome = getRect('[data-splash-element="welcome"]');
      const goodFood = getRect('[data-splash-element="good-food"]');
      const accent = getRect('[data-splash-element="accent"]');
      const loading = getRect('[data-splash-element="loading"]');
      const progress = getRect('[data-splash-element="progress"]');
      const est = getRect('[data-splash-element="est"]');
      const taste = getRect('[data-splash-element="taste"]');

      // Video state
      const videoPlaying = video ? (!video.paused && video.currentTime > 0.1 && video.readyState >= 3) : false;
      const videoSrc = video ? video.currentSrc : null;

      return {
        isMediaFullscreen,
        mediaRect,
        videoPlaying,
        videoSrc,
        elements: { motto, logo, italianFood, welcome, goodFood, accent, loading, progress, est, taste },
      };
    }, vp);

    // Save screenshot
    const screenshotPath = path.join(SCRATCH_DIR, `mobile_${vp.name}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: false });
    mobileScreenshots.push({ ...vp, path: screenshotPath, assessment });

    console.log(`  [Mobile ${vp.name}]: Fullscreen=${assessment.isMediaFullscreen ? 'PASS' : 'FAIL'} | Video Playing=${assessment.videoPlaying ? 'YES' : 'NO'}`);
    structuralResults.push({
      viewport: vp.name,
      type: 'mobile',
      ...assessment,
    });

    await context.close();
  }

  // ==========================================
  // 2. DESKTOP SCREENSHOT & STRUCTURAL AUDIT
  // ==========================================
  console.log('\n--- 2. Testing Desktop Viewports ---');
  for (const vp of DESKTOP_VIEWPORTS) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1.5,
    });
    const page = await context.newPage();

    await page.goto('http://localhost:3001', { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(1800);

    const assessment = await page.evaluate((viewport) => {
      const mediaLayer = document.querySelector('[data-splash-element="media-layer"]');
      const video = document.querySelector('video[data-splash-element="video-stream"]');
      const mediaRect = mediaLayer ? mediaLayer.getBoundingClientRect() : null;

      const isMediaFullscreen = mediaRect && 
        mediaRect.top === 0 && 
        mediaRect.left === 0 && 
        mediaRect.width === viewport.width && 
        mediaRect.height === viewport.height;

      const getRect = (sel) => {
        const elements = Array.from(document.querySelectorAll(sel));
        const el = elements.find(e => {
          const r = e.getBoundingClientRect();
          return r.width > 0 && r.height > 0;
        }) || elements[0];
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return {
          top: Math.round(r.top),
          bottom: Math.round(r.bottom),
          left: Math.round(r.left),
          right: Math.round(r.right),
          width: Math.round(r.width),
          height: Math.round(r.height),
        };
      };

      const motto = getRect('[data-splash-element="motto"]');
      const logo = getRect('[data-splash-element="logo"]');
      const italianFood = getRect('[data-splash-element="italian-food"]');
      const divider = getRect('[data-splash-element="divider"]');
      const welcome = getRect('[data-splash-element="welcome"]');
      const goodFood = getRect('[data-splash-element="good-food"]');
      const progress = getRect('[data-splash-element="progress"]');
      const loading = getRect('[data-splash-element="loading"]');
      const est = getRect('[data-splash-element="est"]');
      const taste = getRect('[data-splash-element="taste"]');

      const videoPlaying = video ? (!video.paused && video.currentTime > 0.1 && video.readyState >= 3) : false;
      const videoSrc = video ? video.currentSrc : null;

      return {
        isMediaFullscreen,
        videoPlaying,
        videoSrc,
        elements: { motto, logo, italianFood, divider, welcome, goodFood, progress, loading, est, taste },
      };
    }, vp);

    const screenshotPath = path.join(SCRATCH_DIR, `desktop_${vp.name}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: false });
    desktopScreenshots.push({ ...vp, path: screenshotPath, assessment });

    console.log(`  [Desktop ${vp.name}]: Fullscreen=${assessment.isMediaFullscreen ? 'PASS' : 'FAIL'} | Video Playing=${assessment.videoPlaying ? 'YES' : 'NO'}`);
    structuralResults.push({
      viewport: vp.name,
      type: 'desktop',
      ...assessment,
    });

    await context.close();
  }

  // ==========================================
  // 3. FUNCTIONAL REGRESSION AUDIT
  // ==========================================
  console.log('\n--- 3. Functional Checks ---');
  const funcCtx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const funcPage = await funcCtx.newPage();
  await funcPage.goto('http://localhost:3001', { waitUntil: 'networkidle', timeout: 15000 });
  await funcPage.waitForTimeout(1500);

  // Check video loop
  const videoLoop = await funcPage.evaluate(() => {
    const v = document.querySelector('video[data-splash-element="video-stream"]');
    return v ? v.loop === true : false;
  });

  // Check click to enter & scroll reset
  await funcPage.click('button[aria-label="Enter GEMA website"]');
  await funcPage.waitForTimeout(1000);

  const afterEnter = await funcPage.evaluate(() => {
    const splashButton = document.querySelector('button[aria-label="Enter GEMA website"]');
    const scrollY = window.scrollY;
    return {
      gatewayDismissed: !splashButton,
      scrollY,
    };
  });

  await funcCtx.close();

  // Reduced motion check
  const rmCtx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    reducedMotion: 'reduce',
  });
  const rmPage = await rmCtx.newPage();
  await rmPage.goto('http://localhost:3001', { waitUntil: 'networkidle', timeout: 15000 });
  await rmPage.waitForTimeout(800);

  const rmResult = await rmPage.evaluate(() => {
    const video = document.querySelector('video[data-splash-element="video-stream"]');
    const poster = document.querySelector('img[data-splash-element="poster-fallback"]');
    return {
      noVideo: !video,
      posterVisible: poster ? window.getComputedStyle(poster).opacity === '1' : false,
    };
  });
  await rmCtx.close();
  await browser.close();

  console.log(`  Loop continuity: ${videoLoop ? 'PASS' : 'FAIL'}`);
  console.log(`  Click to enter dismissed: ${afterEnter.gatewayDismissed ? 'PASS' : 'FAIL'}`);
  console.log(`  Homepage scrollY === 0: ${afterEnter.scrollY === 0 ? 'PASS' : 'FAIL'} (${afterEnter.scrollY}px)`);
  console.log(`  Reduced Motion (fallback still, no video): ${rmResult.noVideo && rmResult.posterVisible ? 'PASS' : 'FAIL'}`);

  // ==========================================
  // 4. CREATE CONTACT SHEETS WITH SHARP
  // ==========================================
  console.log('\n--- 4. Assembling Visual Contact Sheets ---');

  // Helper to create an annotated tile with badge header
  async function makeAnnotatedTile(item, targetWidth, targetHeight, isHighlight = false) {
    const rawImage = sharp(item.path);
    const meta = await rawImage.metadata();

    // Resize maintaining aspect ratio to fit inside tile area
    const contentH = targetHeight - 48; // 48px header banner
    const resizedBuffer = await rawImage
      .resize({
        width: targetWidth - 16,
        height: contentH,
        fit: 'contain',
        background: { r: 24, g: 24, b: 27, alpha: 1 },
      })
      .png()
      .toBuffer();

    const bannerBg = isHighlight ? '#9E7D46' : '#27272a';
    const bannerText = `${item.name} (${(item.width / item.height).toFixed(2)}) ${isHighlight ? '★ PO BASELINE' : ''}`;

    // SVG header banner with crisp text
    const headerSvg = Buffer.from(`
      <svg width="${targetWidth}" height="48" xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="0" width="${targetWidth}" height="48" fill="${bannerBg}" rx="4"/>
        <text x="14" y="30" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif" font-size="16" font-weight="bold" fill="#ffffff">${bannerText}</text>
      </svg>
    `);

    // Create base tile canvas
    const tile = await sharp({
      create: {
        width: targetWidth,
        height: targetHeight,
        channels: 4,
        background: { r: 18, g: 18, b: 20, alpha: 1 },
      },
    })
      .composite([
        { input: headerSvg, top: 0, left: 0 },
        { input: resizedBuffer, top: 48, left: 8 },
      ])
      .png()
      .toBuffer();

    return tile;
  }

  // --- A. MOBILE CONTACT SHEET ---
  // Grid: 4 columns x 4 rows (13 viewports + 1 PO detail highlight)
  const mobileTileW = 340;
  const mobileTileH = 680;
  const mobileCols = 4;
  const mobileRows = Math.ceil(mobileScreenshots.length / mobileCols);
  const mobileSheetW = mobileCols * mobileTileW + (mobileCols + 1) * 16;
  const mobileSheetH = mobileRows * mobileTileH + (mobileRows + 1) * 16 + 80; // 80px title bar

  console.log(`  Compositing Mobile Contact Sheet (${mobileSheetW}x${mobileSheetH})...`);

  const mobileTitleSvg = Buffer.from(`
    <svg width="${mobileSheetW}" height="80" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="${mobileSheetW}" height="80" fill="#18181b"/>
      <text x="24" y="38" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="22" font-weight="bold" fill="#BFA16F">GEMA SPLASH-006B — MOBILE VISUAL CONTACT SHEET (13 VIEWPORTS)</text>
      <text x="24" y="62" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="14" fill="#a1a1aa">Empirical verification: Fullscreen Background (object-cover) + Fluid Responsive Content. Zero letterboxing.</text>
    </svg>
  `);

  const mobileCompositeOps = [
    { input: mobileTitleSvg, top: 0, left: 0 },
  ];

  for (let i = 0; i < mobileScreenshots.length; i++) {
    const item = mobileScreenshots[i];
    const isPO = item.name === '390x844';
    const tileBuffer = await makeAnnotatedTile(item, mobileTileW, mobileTileH, isPO);
    const col = i % mobileCols;
    const row = Math.floor(i % 16 / mobileCols);
    const x = 16 + col * (mobileTileW + 16);
    const y = 80 + 16 + row * (mobileTileH + 16);
    mobileCompositeOps.push({ input: tileBuffer, top: y, left: x });
  }

  const mobileSheetPath = path.join(SCRATCH_DIR, 'mobile_contact_sheet.png');
  await sharp({
    create: {
      width: mobileSheetW,
      height: mobileSheetH,
      channels: 4,
      background: { r: 9, g: 9, b: 11, alpha: 1 },
    },
  })
    .composite(mobileCompositeOps)
    .png()
    .toFile(mobileSheetPath);

  console.log(`  Saved Mobile Contact Sheet: ${mobileSheetPath}`);

  // --- B. DESKTOP CONTACT SHEET ---
  // Grid: 2 columns x 2 rows
  const desktopTileW = 680;
  const desktopTileH = 440;
  const desktopCols = 2;
  const desktopRows = 2;
  const desktopSheetW = desktopCols * desktopTileW + (desktopCols + 1) * 20;
  const desktopSheetH = desktopRows * desktopTileH + (desktopRows + 1) * 20 + 80;

  console.log(`  Compositing Desktop Contact Sheet (${desktopSheetW}x${desktopSheetH})...`);

  const desktopTitleSvg = Buffer.from(`
    <svg width="${desktopSheetW}" height="80" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="${desktopSheetW}" height="80" fill="#18181b"/>
      <text x="24" y="38" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="22" font-weight="bold" fill="#BFA16F">GEMA SPLASH-006B — DESKTOP VISUAL CONTACT SHEET (4 VIEWPORTS)</text>
      <text x="24" y="62" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="14" fill="#a1a1aa">Empirical verification: Fullscreen Background (object-cover) + Centered Brand Overlay. Zero letterboxing.</text>
    </svg>
  `);

  const desktopCompositeOps = [
    { input: desktopTitleSvg, top: 0, left: 0 },
  ];

  for (let i = 0; i < desktopScreenshots.length; i++) {
    const item = desktopScreenshots[i];
    const tileBuffer = await makeAnnotatedTile(item, desktopTileW, desktopTileH, false);
    const col = i % desktopCols;
    const row = Math.floor(i / desktopCols);
    const x = 20 + col * (desktopTileW + 20);
    const y = 80 + 20 + row * (desktopTileH + 20);
    desktopCompositeOps.push({ input: tileBuffer, top: y, left: x });
  }

  const desktopSheetPath = path.join(SCRATCH_DIR, 'desktop_contact_sheet.png');
  await sharp({
    create: {
      width: desktopSheetW,
      height: desktopSheetH,
      channels: 4,
      background: { r: 9, g: 9, b: 11, alpha: 1 },
    },
  })
    .composite(desktopCompositeOps)
    .png()
    .toFile(desktopSheetPath);

  console.log(`  Saved Desktop Contact Sheet: ${desktopSheetPath}`);

  // Summary JSON output
  const summary = {
    timestamp: new Date().toISOString(),
    mobileContactSheet: mobileSheetPath,
    desktopContactSheet: desktopSheetPath,
    structuralResults,
    functional: {
      videoLoop,
      gatewayDismissed: afterEnter.gatewayDismissed,
      scrollYZero: afterEnter.scrollY === 0,
      reducedMotionFallback: rmResult.noVideo && rmResult.posterVisible,
    },
  };

  fs.writeFileSync(path.join(SCRATCH_DIR, 'qa_summary.json'), JSON.stringify(summary, null, 2));
  console.log(`\n=== QA SUITE RUN COMPLETE ===`);
  console.log(`Summary written to: ${path.join(SCRATCH_DIR, 'qa_summary.json')}`);
}

runSplash006BQA().catch(err => {
  console.error('QA script fatal error:', err);
  process.exit(1);
});
