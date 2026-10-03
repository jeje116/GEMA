const { chromium } = require('playwright');

async function runVerification() {
  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
  });

  const results = {
    bugA: {},
    journalParity: {},
    bugB: {},
    nonHomepage: {},
    spaNavigation: {},
    resdiary: {},
  };

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    ignoreHTTPSErrors: true,
  });

  const page = await context.newPage();

  // Track console errors
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push({
        text: msg.text(),
        location: msg.location(),
      });
    }
  });

  console.log('====================================================');
  console.log('TEST 1: NEXT.JS DEV OVERLAY ISSUES & CONSOLE ERRORS');
  console.log('====================================================');

  await page.goto('https://localhost:3002/en', { waitUntil: 'load' });
  await page.waitForTimeout(2000);

  // Check Next.js dev overlay badge
  const overlayDataEn = await page.evaluate(() => {
    const issuesBadge = document.querySelector('nextjs-portal, [data-nextjs-toast="true"], [data-has-issues="true"]');
    const toast = document.querySelector('[data-nextjs-toast="true"]');
    const dialog = document.querySelector('[data-nextjs-dialog="true"]');
    return {
      hasIssuesBadge: !!issuesBadge && issuesBadge.innerHTML.includes('Issue'),
      badgeText: issuesBadge ? issuesBadge.innerText : null,
      hasToast: !!toast,
      hasDialog: !!dialog,
    };
  });

  results.bugA.enIssuesBadge = overlayDataEn.hasIssuesBadge;
  results.bugA.enBadgeText = overlayDataEn.badgeText;
  results.bugA.enConsoleErrors = consoleErrors.filter(e => !e.text.includes('favicon.ico') && !e.text.includes('/cdn-cgi/rum')).length;

  console.log('HTTPS /en Next Issue Badge:', overlayDataEn.hasIssuesBadge ? 'HAS ISSUES' : '0 ISSUES (CLEAN)');
  console.log('HTTPS /en Application Console Errors:', results.bugA.enConsoleErrors);

  // Check /id
  consoleErrors.length = 0;
  await page.goto('https://localhost:3002/id', { waitUntil: 'load' });
  await page.waitForTimeout(2000);

  const overlayDataId = await page.evaluate(() => {
    const issuesBadge = document.querySelector('nextjs-portal, [data-nextjs-toast="true"], [data-has-issues="true"]');
    return {
      hasIssuesBadge: !!issuesBadge && issuesBadge.innerHTML.includes('Issue'),
      badgeText: issuesBadge ? issuesBadge.innerText : null,
    };
  });

  results.bugA.idIssuesBadge = overlayDataId.hasIssuesBadge;
  results.bugA.idConsoleErrors = consoleErrors.filter(e => !e.text.includes('favicon.ico') && !e.text.includes('/cdn-cgi/rum')).length;
  console.log('HTTPS /id Next Issue Badge:', overlayDataId.hasIssuesBadge ? 'HAS ISSUES' : '0 ISSUES (CLEAN)');
  console.log('HTTPS /id Application Console Errors:', results.bugA.idConsoleErrors);

  // ------------------------------------------------------------------------
  console.log('\n====================================================');
  console.log('TEST 2: SINGLE-IMAGE JOURNAL EDITORIAL PARITY');
  console.log('====================================================');

  await page.goto('https://localhost:3002/en/journal/inside-gemas-fresh-pasta', { waitUntil: 'load' });
  await page.waitForTimeout(2000);

  // Dismiss gateway if active on journal
  const enterBtn = page.locator('button[aria-label="Enter GEMA website"]');
  if (await enterBtn.count() > 0) {
    await enterBtn.click();
    await page.waitForTimeout(1000);
  }

  const journalArticleData = await page.evaluate(() => {
    const article = document.querySelector('article') || document.querySelector('main');
    if (!article) return { error: 'No article element found' };

    // Cover images vs body images
    const allImages = Array.from(article.querySelectorAll('img'));
    const allFigures = Array.from(article.querySelectorAll('figure'));
    const paragraphs = Array.from(article.querySelectorAll('p')).map(p => p.innerText.trim());

    // Check broken images
    const brokenImages = allImages.filter(img => !img.complete || img.naturalWidth === 0);

    // Look for media 32 in src attributes
    const hasMedia32 = allImages.some(img => img.src.includes('32') || img.src.includes('shared-unsplash-1551183053'));

    return {
      totalImages: allImages.length,
      imageSources: allImages.map(img => img.src),
      totalFigures: allFigures.length,
      brokenImagesCount: brokenImages.length,
      paragraphsCount: paragraphs.length,
      hasTextSurrounding: paragraphs.length > 0,
      hasMedia32,
    };
  });

  results.journalParity = journalArticleData;
  console.log('Journal Article Data:', JSON.stringify(journalArticleData, null, 2));

  // ------------------------------------------------------------------------
  console.log('\n====================================================');
  console.log('TEST 3: HOMEPAGE POST-GATEWAY SCROLL NORMALIZATION');
  console.log('====================================================');

  // 3A: Fresh Load /en
  console.log('--- 3A: Fresh Load on /en ---');
  await page.goto('https://localhost:3002/en', { waitUntil: 'load' });
  await page.waitForTimeout(500);
  const freshGatewayVisibleScrollY = await page.evaluate(() => window.scrollY);
  console.log('Gateway Visible scrollY (Fresh Load /en):', freshGatewayVisibleScrollY);

  await page.waitForTimeout(2500);
  await page.locator('button[aria-label="Enter GEMA website"]').click();
  await page.waitForTimeout(1000);
  const freshExitScrollY = await page.evaluate(() => window.scrollY);
  console.log('Gateway Exit scrollY (Fresh Load /en):', freshExitScrollY);

  results.bugB.freshEnGatewayVisible = freshGatewayVisibleScrollY;
  results.bugB.freshEnExit = freshExitScrollY;

  // 3B: Previously Scrolled -> Reload -> Enter /en (Primary Reproduction Case)
  console.log('\n--- 3B: Previously Scrolled -> Reload -> Enter on /en ---');
  await page.evaluate(() => window.scrollTo(0, 1200));
  await page.waitForTimeout(300);
  console.log('Scrolled to:', await page.evaluate(() => window.scrollY));

  console.log('Reloading page...');
  await page.reload({ waitUntil: 'load' });
  await page.waitForTimeout(500);
  const scrolledReloadGatewayVisibleScrollY = await page.evaluate(() => window.scrollY);
  console.log('Gateway Visible scrollY (Scrolled Reload /en):', scrolledReloadGatewayVisibleScrollY);

  await page.waitForTimeout(2500);
  await page.locator('button[aria-label="Enter GEMA website"]').click();
  await page.waitForTimeout(1000);
  const scrolledReloadExitScrollY = await page.evaluate(() => window.scrollY);
  console.log('Gateway Exit scrollY (Scrolled Reload /en):', scrolledReloadExitScrollY);

  results.bugB.scrolledReloadEnGatewayVisible = scrolledReloadGatewayVisibleScrollY;
  results.bugB.scrolledReloadEnExit = scrolledReloadExitScrollY;

  // 3C: Previously Scrolled -> Reload -> Enter /id
  console.log('\n--- 3C: Previously Scrolled -> Reload -> Enter on /id ---');
  await page.goto('https://localhost:3002/id', { waitUntil: 'load' });
  await page.waitForTimeout(3000);
  await page.locator('button[aria-label="Enter GEMA website"]').click();
  await page.waitForTimeout(1000);

  await page.evaluate(() => window.scrollTo(0, 1200));
  await page.waitForTimeout(300);
  console.log('Scrolled on /id to:', await page.evaluate(() => window.scrollY));

  console.log('Reloading /id page...');
  await page.reload({ waitUntil: 'load' });
  await page.waitForTimeout(500);
  const scrolledReloadIdGatewayVisible = await page.evaluate(() => window.scrollY);
  console.log('Gateway Visible scrollY (Scrolled Reload /id):', scrolledReloadIdGatewayVisible);

  await page.waitForTimeout(2500);
  await page.locator('button[aria-label="Enter GEMA website"]').click();
  await page.waitForTimeout(1000);
  const scrolledReloadIdExit = await page.evaluate(() => window.scrollY);
  console.log('Gateway Exit scrollY (Scrolled Reload /id):', scrolledReloadIdExit);

  results.bugB.scrolledReloadIdGatewayVisible = scrolledReloadIdGatewayVisible;
  results.bugB.scrolledReloadIdExit = scrolledReloadIdExit;

  // 3D: Mobile Viewport (390×844)
  console.log('\n--- 3D: Mobile Viewport (390×844) Previously Scrolled Reload ---');
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    ignoreHTTPSErrors: true,
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto('https://localhost:3002/en', { waitUntil: 'load' });
  await mobilePage.waitForTimeout(3000);
  await mobilePage.locator('button[aria-label="Enter GEMA website"]').click();
  await mobilePage.waitForTimeout(1000);

  await mobilePage.evaluate(() => window.scrollTo(0, 1200));
  await mobilePage.waitForTimeout(300);
  await mobilePage.reload({ waitUntil: 'load' });
  await mobilePage.waitForTimeout(500);
  const mobileGatewayVisible = await mobilePage.evaluate(() => window.scrollY);
  await mobilePage.waitForTimeout(2500);
  await mobilePage.locator('button[aria-label="Enter GEMA website"]').click();
  await mobilePage.waitForTimeout(1000);
  const mobileExit = await mobilePage.evaluate(() => window.scrollY);

  console.log('Mobile Gateway Visible scrollY:', mobileGatewayVisible);
  console.log('Mobile Gateway Exit scrollY:', mobileExit);
  results.bugB.mobileGatewayVisible = mobileGatewayVisible;
  results.bugB.mobileExit = mobileExit;
  await mobileContext.close();

  // ------------------------------------------------------------------------
  console.log('\n====================================================');
  console.log('TEST 4: SPA NAVIGATION REGRESSION');
  console.log('====================================================');

  // Currently on /id at top. Click navigation link to Menu
  console.log('Navigating from /id to Menu via header link...');
  const menuLink = page.locator('header a[href*="/menu"]').first();
  await menuLink.click();
  await page.waitForTimeout(1500);

  const onMenuUrl = page.url();
  console.log('Current URL after Menu click:', onMenuUrl);

  // Check if Gateway reopened
  const gatewayOnMenu = await page.locator('button[aria-label="Enter GEMA website"]').count();
  console.log('Gateway count on Menu after SPA navigation:', gatewayOnMenu);
  results.spaNavigation.gatewayOnMenu = gatewayOnMenu;

  // Navigate back to Homepage via logo
  console.log('Navigating back to Homepage via logo...');
  const logoLink = page.locator('header a[aria-label="GEMA Home"]');
  await logoLink.click();
  await page.waitForTimeout(1500);

  const backOnHomeUrl = page.url();
  console.log('Current URL after Logo click:', backOnHomeUrl);
  const gatewayBackOnHome = await page.locator('button[aria-label="Enter GEMA website"]').count();
  console.log('Gateway count back on Home:', gatewayBackOnHome);
  results.spaNavigation.gatewayBackOnHome = gatewayBackOnHome;

  // ------------------------------------------------------------------------
  console.log('\n====================================================');
  console.log('TEST 5: NON-HOMEPAGE SCROLL INDEPENDENCE');
  console.log('====================================================');

  await page.goto('https://localhost:3002/en/menu', { waitUntil: 'load' });
  await page.waitForTimeout(1000);
  const enterBtnMenu = page.locator('button[aria-label="Enter GEMA website"]');
  if (await enterBtnMenu.count() > 0) {
    await enterBtnMenu.click();
    await page.waitForTimeout(1000);
  }

  // Scroll down on menu
  await page.evaluate(() => window.scrollTo(0, 600));
  await page.waitForTimeout(300);
  const menuScrollY = await page.evaluate(() => window.scrollY);
  console.log('Menu scrollY after user scroll:', menuScrollY);
  results.nonHomepage.menuScrollPreserved = menuScrollY > 500;

  // ------------------------------------------------------------------------
  console.log('\n====================================================');
  console.log('TEST 6: RESDIARY QA OVER HTTPS');
  console.log('====================================================');

  await page.goto('https://localhost:3002/en', { waitUntil: 'load' });
  await page.waitForTimeout(3000);
  const enterBtnRd = page.locator('button[aria-label="Enter GEMA website"]');
  if (await enterBtnRd.count() > 0) {
    await enterBtnRd.click();
    await page.waitForTimeout(1000);
  }

  // Open reservation modal
  console.log('Opening Reservation overlay...');
  const reserveBtn = page.locator('header button:has-text("Reserve a Table"), button:has-text("Reserve")').first();
  await reserveBtn.click();
  await page.waitForTimeout(3000);

  // Inspect ResDiary widget inside drawer (#rd-widget-frame)
  const rdInspection = await page.evaluate(() => {
    const frame = document.getElementById('rd-widget-frame');
    const images = Array.from(document.querySelectorAll('#rd-widget-frame img'));
    const broken = images.filter(img => !img.complete || img.naturalWidth === 0);
    const text = frame ? frame.innerText : '';
    const hasControls = text.includes('Date') || text.includes('Time') || text.includes('Party') || text.includes('Guests') || text.includes('Next') || text.includes('Restaurant');

    return {
      framePresent: !!frame,
      frameChildrenCount: frame ? frame.children.length : 0,
      totalImages: images.length,
      brokenImages: broken.length,
      hasControls,
    };
  });

  console.log('ResDiary Widget Inspection:', JSON.stringify(rdInspection, null, 2));
  results.resdiary.inspection = rdInspection;

  // Close reservation modal
  console.log('Closing Reservation overlay...');
  const closeBtn = page.locator('button[aria-label="Close reservation panel"], button[aria-label="Close reservation modal"], button[aria-label="Close"]');
  if (await closeBtn.count() > 0) {
    await closeBtn.first().click();
    await page.waitForTimeout(1000);
  }

  // Reopen
  console.log('Reopening Reservation overlay...');
  const reserveBtnAfterClose = page.locator('header button:has-text("Reserve a Table"), button:has-text("Reserve")').first();
  await reserveBtnAfterClose.click();
  await page.waitForTimeout(1500);
  const reopenedPresent = await page.evaluate(() => {
    const frame = document.getElementById('rd-widget-frame');
    return !!frame && frame.children.length > 0;
  });
  console.log('Reopened Widget Frame Active:', reopenedPresent);
  results.resdiary.reopenedPresent = reopenedPresent;

  // Close again
  if (await closeBtn.count() > 0) {
    await closeBtn.first().click();
  }

  console.log('\n====================================================');
  console.log('FINAL AGGREGATED QA RESULTS:');
  console.log('====================================================');
  console.log(JSON.stringify(results, null, 2));

  await browser.close();
}

runVerification().catch(err => {
  console.error('Verification failed with error:', err);
  process.exit(1);
});
