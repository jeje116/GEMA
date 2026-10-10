const path = require('path');
const fs = require('fs');

function loadPlaywright() {
  try {
    return require('playwright');
  } catch {
    const candidates = [
      process.env.PLAYWRIGHT_PATH,
      path.resolve(process.env.HOME || '', 'scratch_playwright/node_modules/playwright'),
      path.resolve(__dirname, '../../node_modules/playwright'),
    ].filter(Boolean);

    for (const candidate of candidates) {
      try {
        return require(candidate);
      } catch {}
    }
    throw new Error(
      'Playwright could not be loaded. Ensure playwright is installed or set PLAYWRIGHT_PATH.'
    );
  }
}

const { chromium } = loadPlaywright();
const ARTIFACT_DIR = process.env.ARTIFACT_DIR || path.resolve(__dirname, '../test-results');
if (!fs.existsSync(ARTIFACT_DIR)) {
  fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
}

async function runProdVerification() {
  const browser = await chromium.launch({ headless: true });
  const results = {
    checks: {},
    measurements: {},
    screenshots: []
  };

  try {
    const contextDesktop = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 1
    });
    await contextDesktop.route('**/*resdiary*/**', route => route.abort('blockedbyclient'));

    // 1. Desktop 1440x900 QA
    console.log('--- Running Desktop 1440x900 QA ---');
    const pageDesktop = await contextDesktop.newPage();

    const consoleErrors = [];
    pageDesktop.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    const failedRequests = [];
    pageDesktop.on('requestfailed', req => {
      failedRequests.push(`${req.method()} ${req.url()}: ${req.failure()?.errorText}`);
    });

    await pageDesktop.goto('https://gemagroup.id/en/experience', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await pageDesktop.waitForTimeout(2000);

    // Dismiss gateway if present
    const enterBtn = await pageDesktop.$('button[aria-label="Enter GEMA website"], button:has-text("ENTER"), button:has-text("Enter")');
    if (enterBtn) {
      await enterBtn.click();
      await pageDesktop.waitForTimeout(1500);
    }

    // Scroll to The Craft section
    const craftSection = await pageDesktop.locator('section:has(h2:has-text("The Craft"))');
    await craftSection.scrollIntoViewIfNeeded();
    await pageDesktop.waitForTimeout(1000);

    // Verify Copywriting
    const headingText = await craftSection.locator('h2').textContent();
    const introText = await craftSection.locator('p.italic').textContent();
    const bodyText = await craftSection.locator('p.text-base, p.text-lg').textContent();

    results.checks.desktopHeading = headingText.trim() === 'The Craft';
    results.checks.desktopIntroMatches = introText.includes('Behind every plate is a rhythm');
    results.checks.desktopBodyMatches = bodyText.includes('The experience at GEMA is shaped as much');

    // Verify Image Element and Dimensions
    const imageContainer = craftSection.locator('div.relative.aspect-\\[5\\/6\\]').first();
    const imageBox = await imageContainer.boundingBox();
    const imgElement = imageContainer.locator('img');
    const imgSrc = await imgElement.getAttribute('src');
    const imgAlt = await imgElement.getAttribute('alt');

    results.measurements.desktop1440 = {
      containerWidth: imageBox.width,
      containerHeight: imageBox.height,
      aspectRatio: (imageBox.width / imageBox.height).toFixed(4)
    };
    results.checks.desktopSrcIsCMS = imgSrc.includes('/api/media/file/experience-the-craft-chef-plating.webp');
    results.checks.desktopAltMatches = imgAlt === 'Chef plating a dish at GEMA';
    results.checks.desktopDimensionsApproved = imageBox.width <= 471 && imageBox.height <= 561 && imageBox.height >= 550;

    // Full page & section screenshot
    const shotDesktopSection = path.join(ARTIFACT_DIR, 'prod_the_craft_desktop_1440.png');
    await craftSection.screenshot({ path: shotDesktopSection });
    results.screenshots.push(shotDesktopSection);

    // 2. Mobile 390x844 QA
    console.log('--- Running Mobile 390x844 QA ---');
    const contextMobile = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 2,
      isMobile: true
    });
    await contextMobile.route('**/*resdiary*/**', route => route.abort('blockedbyclient'));
    const pageMobile = await contextMobile.newPage();

    await pageMobile.goto('https://gemagroup.id/en/experience', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await pageMobile.waitForTimeout(2000);

    const enterBtnMob = await pageMobile.$('button[aria-label="Enter GEMA website"]');
    if (enterBtnMob) {
      await enterBtnMob.click();
      await pageMobile.waitForTimeout(1500);
    }

    const craftSectionMob = await pageMobile.locator('section:has(h2:has-text("The Craft"))');
    await craftSectionMob.scrollIntoViewIfNeeded();
    await pageMobile.waitForTimeout(1000);

    const imageContainerMob = craftSectionMob.locator('div.relative.aspect-\\[5\\/6\\]').first();
    const imageBoxMob = await imageContainerMob.boundingBox();
    const imgElementMob = imageContainerMob.locator('img');
    const imgSrcMob = await imgElementMob.getAttribute('src');

    results.measurements.mobile390 = {
      containerWidth: imageBoxMob.width,
      containerHeight: imageBoxMob.height,
      aspectRatio: (imageBoxMob.width / imageBoxMob.height).toFixed(4)
    };
    results.checks.mobileSrcIsCMS = imgSrcMob.includes('/api/media/file/experience-the-craft-chef-plating.webp');
    results.checks.mobileResponsiveWidth = imageBoxMob.width <= 350;

    // Check horizontal overflow
    const hasHorizontalOverflow = await pageMobile.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    results.checks.mobileZeroHorizontalOverflow = !hasHorizontalOverflow;

    const shotMobileSection = path.join(ARTIFACT_DIR, 'prod_the_craft_mobile_390.png');
    await craftSectionMob.screenshot({ path: shotMobileSection });
    results.screenshots.push(shotMobileSection);

    // 3. Regression Checks
    console.log('--- Running Regression Checks ---');
    // A. Day to Night Section on Experience
    const dayToNight = await pageDesktop.locator('section:has(h2:has-text("Day to Night"))');
    results.checks.dayToNightExists = (await dayToNight.count()) > 0;

    // B. Experience Hero
    const heroSection = await pageDesktop.locator('div:has(h1:has-text("A Place to Linger"))');
    results.checks.experienceHeroExists = (await heroSection.count()) > 0;

    // C. Homepage Hero
    const pageHome = await contextDesktop.newPage();
    await pageHome.goto('https://gemagroup.id/en', { waitUntil: 'domcontentloaded', timeout: 30000 });
    const enterBtnHome = await pageHome.$('button[aria-label="Enter GEMA website"]');
    if (enterBtnHome) {
      await enterBtnHome.click();
      await pageHome.waitForTimeout(1500);
    }
    const homeHeroImg = await pageHome.locator('section img[src*="home-hero-open-kitchen"]').count();
    results.checks.homeHeroPhotoAPreserved = homeHeroImg > 0;

    // D. Reservation drawer CTA
    const reserveBtn = await pageDesktop.locator('button:has-text("RESERVE"), button:has-text("Reserve")').first();
    results.checks.reservationButtonActive = await reserveBtn.isVisible();

    // E. Indonesian localization fallback behavior
    const pageID = await contextDesktop.newPage();
    await pageID.goto('https://gemagroup.id/id/experience', { waitUntil: 'domcontentloaded', timeout: 30000 });
    const enterBtnID = await pageID.$('button[aria-label="Enter GEMA website"]');
    if (enterBtnID) {
      await enterBtnID.click();
      await pageID.waitForTimeout(1500);
    }
    const craftIDHeading = await pageID.locator('section:has(h2:has-text("The Craft")) h2').textContent().catch(() => null);
    results.checks.idLocaleCraftFallback = craftIDHeading?.trim() === 'The Craft';

    results.networkErrors = failedRequests.filter(u => !u.includes('analytics') && !u.includes('gtm'));
    results.consoleErrors = consoleErrors;

    console.log('=== VERIFICATION SUMMARY ===');
    console.log(JSON.stringify(results, null, 2));

  } finally {
    await browser.close();
  }
}

runProdVerification().catch(err => {
  console.error('Browser QA script failed:', err);
  process.exit(1);
});
