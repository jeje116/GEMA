/**
 * SPLASH-003 QA: Verify Gema logo bottom clipping fix
 * Requires: npx playwright (installed globally via npx)
 */

async function runSplash003Qa() {
  // Dynamic import to work with npx
  let chromium;
  try {
    ({ chromium } = require('playwright'));
  } catch {
    console.error('playwright not found as module — trying playwright-core');
    try {
      ({ chromium } = require('playwright-core'));
    } catch {
      console.error('Neither playwright nor playwright-core found.');
      console.error('Run: npm install -D playwright');
      process.exit(1);
    }
  }

  console.log('=== GEMA SPLASH-003 LOGO CLIPPING FIX QA ===\n');

  const browser = await chromium.launch({ headless: true });

  // ====== DESKTOP TEST ======
  console.log('--- Desktop (1440x900) ---');
  const desktopCtx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const desktopPage = await desktopCtx.newPage();
  await desktopPage.goto('http://localhost:3001', { waitUntil: 'networkidle', timeout: 15000 });
  await desktopPage.waitForTimeout(3500);

  await desktopPage.screenshot({ path: '/tmp/splash-003-desktop-full.png', fullPage: false });

  const desktopInfo = await desktopPage.evaluate(() => {
    const imgs = document.querySelectorAll('img[alt="Gema restaurant & societiet"]');
    const results = [];
    imgs.forEach((img, i) => {
      const container = img.parentElement;
      const containerRect = container.getBoundingClientRect();
      const containerStyle = window.getComputedStyle(container);
      const imgRect = img.getBoundingClientRect();
      const parentRect = container.parentElement.getBoundingClientRect();
      const parentStyle = window.getComputedStyle(container.parentElement);
      results.push({
        index: i,
        containerWidth: Math.round(containerRect.width),
        containerHeight: Math.round(containerRect.height),
        containerTop: Math.round(containerRect.top),
        containerBottom: Math.round(containerRect.bottom),
        containerOverflow: containerStyle.overflow,
        parentOverflow: parentStyle.overflow,
        parentHeight: Math.round(parentRect.height),
        imgRenderedWidth: Math.round(imgRect.width),
        imgRenderedHeight: Math.round(imgRect.height),
        objectFit: window.getComputedStyle(img).objectFit,
        isVisible: containerRect.width > 0 && containerRect.height > 0,
        imgBottomWithinContainer: imgRect.bottom <= containerRect.bottom + 1,
        containerBottomWithinParent: containerRect.bottom <= parentRect.bottom + 1
      });
    });
    return results;
  });

  const visibleDesktop = desktopInfo.find(i => i.isVisible);
  if (visibleDesktop) {
    console.log(`  Container: ${visibleDesktop.containerWidth}x${visibleDesktop.containerHeight} (overflow: ${visibleDesktop.containerOverflow})`);
    console.log(`  Image rendered: ${visibleDesktop.imgRenderedWidth}x${visibleDesktop.imgRenderedHeight}`);
    console.log(`  Image within container: ${visibleDesktop.imgBottomWithinContainer}`);
    console.log(`  Container within parent: ${visibleDesktop.containerBottomWithinParent}`);
    console.log(`  Parent overflow: ${visibleDesktop.parentOverflow}`);
    console.log(`  PASS: Logo fully contained = ${visibleDesktop.imgBottomWithinContainer && visibleDesktop.containerBottomWithinParent}`);

    // Crop screenshot around logo
    const clipY = Math.max(0, visibleDesktop.containerTop - 20);
    const clipH = visibleDesktop.containerHeight + 60;
    await desktopPage.screenshot({
      path: '/tmp/splash-003-desktop-logo-closeup.png',
      clip: { x: 1440 / 2 - 250, y: clipY, width: 500, height: clipH }
    });
    console.log('  Logo closeup saved: /tmp/splash-003-desktop-logo-closeup.png');
  } else {
    console.log('  WARNING: No visible logo found on desktop');
  }

  await desktopCtx.close();

  // ====== MOBILE TEST ======
  console.log('\n--- Mobile (390x844) ---');
  const mobileCtx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const mobilePage = await mobileCtx.newPage();
  await mobilePage.goto('http://localhost:3001', { waitUntil: 'networkidle', timeout: 15000 });
  await mobilePage.waitForTimeout(3500);

  await mobilePage.screenshot({ path: '/tmp/splash-003-mobile-full.png', fullPage: false });

  const mobileInfo = await mobilePage.evaluate(() => {
    const imgs = document.querySelectorAll('img[alt="Gema restaurant & societiet"]');
    const results = [];
    imgs.forEach((img, i) => {
      const container = img.parentElement;
      const containerRect = container.getBoundingClientRect();
      const imgRect = img.getBoundingClientRect();
      const parentRect = container.parentElement.getBoundingClientRect();
      results.push({
        index: i,
        containerWidth: Math.round(containerRect.width),
        containerHeight: Math.round(containerRect.height),
        containerTop: Math.round(containerRect.top),
        containerBottom: Math.round(containerRect.bottom),
        isVisible: containerRect.width > 0 && containerRect.height > 0,
        imgBottomWithinContainer: imgRect.bottom <= containerRect.bottom + 1,
        containerBottomWithinParent: containerRect.bottom <= parentRect.bottom + 1
      });
    });
    return results;
  });

  const visibleMobile = mobileInfo.find(i => i.isVisible);
  if (visibleMobile) {
    console.log(`  Container: ${visibleMobile.containerWidth}x${visibleMobile.containerHeight}`);
    console.log(`  Image within container: ${visibleMobile.imgBottomWithinContainer}`);
    console.log(`  Container within parent: ${visibleMobile.containerBottomWithinParent}`);
    console.log(`  PASS: Logo fully contained = ${visibleMobile.imgBottomWithinContainer && visibleMobile.containerBottomWithinParent}`);

    const clipY = Math.max(0, visibleMobile.containerTop - 20);
    const clipH = visibleMobile.containerHeight + 60;
    await mobilePage.screenshot({
      path: '/tmp/splash-003-mobile-logo-closeup.png',
      clip: { x: 390 / 2 - 150, y: clipY, width: 300, height: clipH }
    });
    console.log('  Logo closeup saved: /tmp/splash-003-mobile-logo-closeup.png');
  } else {
    console.log('  WARNING: No visible logo found on mobile');
  }

  await mobileCtx.close();
  await browser.close();
  console.log('\n=== SPLASH-003 QA COMPLETE ===');
}

runSplash003Qa().catch(err => {
  console.error('QA failed:', err);
  process.exit(1);
});
