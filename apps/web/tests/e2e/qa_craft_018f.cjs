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
const ARTIFACTS_DIR = process.env.ARTIFACTS_DIR || process.env.ARTIFACT_DIR || path.resolve(__dirname, '../test-results');
if (!fs.existsSync(ARTIFACTS_DIR)) {
  fs.mkdirSync(ARTIFACTS_DIR, { recursive: true });
}

const BASE_URL = process.env.BASE_URL || 'http://localhost:3001';

async function runQA() {
  const browser = await chromium.launch();
  const results = {};

  const desktopViewports = [
    { name: 'desktop_1440', width: 1440, height: 900 },
    { name: 'desktop_1280', width: 1280, height: 800 },
    { name: 'desktop_1920', width: 1920, height: 1080 },
  ];

  const mobileViewports = [
    { name: 'mobile_390', width: 390, height: 844, isMobile: true },
    { name: 'mobile_375', width: 375, height: 812, isMobile: true },
  ];

  for (const vp of [...desktopViewports, ...mobileViewports]) {
    console.log(`\n=== Testing ${vp.name} (${vp.width}x${vp.height}) ===`);
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 2,
      isMobile: !!vp.isMobile,
    });
    await context.route('**/*resdiary*/**', route => route.abort('blockedbyclient'));
    const page = await context.newPage();

    await page.goto(`${BASE_URL}/en/experience`, { waitUntil: 'domcontentloaded', timeout: 30000 });

    // Explicitly click the Gateway Enter button and wait for it to exit
    const enterBtn = page.locator('button[aria-label="Enter GEMA website"]');
    if (await enterBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      console.log('Dismissing Gateway overlay...');
      await enterBtn.click();
      await enterBtn.waitFor({ state: 'detached', timeout: 5000 }).catch(() => {});
      await page.waitForTimeout(600);
    }

    // Wait for PageReveal animation to complete (1.8s) and hide the offscreen curtain for clean Playwright screenshot
    await page.waitForTimeout(1800);
    await page.evaluate(() => {
      document.querySelectorAll('div').forEach(el => {
        if (el.className && el.className.includes('z-[60]')) {
          el.style.display = 'none';
        }
      });
    });

    // Locate "The Craft" section
    const craftHeading = await page.waitForSelector('text=The Craft', { timeout: 10000 });
    await craftHeading.scrollIntoViewIfNeeded();
    // Wait for motion animation to settle (opacity and scale transitions)
    await page.waitForTimeout(1500);

    const sectionLocator = page.locator('section').filter({ hasText: 'The Craft' }).first();
    const sectionBox = await sectionLocator.boundingBox();

    // Locate image container and img element
    const craftImg = page.locator('img[alt*="Chef"]').first();
    await craftImg.waitFor({ state: 'visible', timeout: 5000 });
    const imgBox = await craftImg.boundingBox();

    // Container box (parent motion.div)
    const imgContainer = craftImg.locator('xpath=ancestor::div[contains(@class, "aspect-[5/6]") or contains(@class, "aspect-")]').first();
    const containerBox = await imgContainer.boundingBox();

    // Left column text box
    const textBox = await page.locator('h2:text("The Craft")').locator('xpath=ancestor::div[contains(@class, "max-w-xl")]').boundingBox();

    // Measure styles and geometry
    const metrics = await page.evaluate(() => {
      const img = document.querySelector('img[alt*="Chef"]');
      const container = img ? img.closest('div[class*="aspect-"]') : null;
      const section = img ? img.closest('section') : null;
      const html = document.documentElement;

      const imgStyle = img ? window.getComputedStyle(img) : null;
      const containerStyle = container ? window.getComputedStyle(container) : null;

      // Check text position vs image position (DOM order & visual order)
      const heading = document.querySelector('h2');
      let textBeforeImg = false;
      if (heading && img) {
        const hRect = heading.getBoundingClientRect();
        const iRect = img.getBoundingClientRect();
        textBeforeImg = hRect.top <= iRect.top;
      }

      return {
        scrollWidth: html.scrollWidth,
        clientWidth: html.clientWidth,
        hasHorizontalOverflow: html.scrollWidth > html.clientWidth,
        textBeforeImg,
        img: {
          src: img ? img.src : null,
          alt: img ? img.alt : null,
          naturalWidth: img ? img.naturalWidth : 0,
          naturalHeight: img ? img.naturalHeight : 0,
          objectFit: imgStyle ? imgStyle.objectFit : null,
          objectPosition: imgStyle ? imgStyle.objectPosition : null,
        },
        container: {
          classes: container ? container.className : null,
          computedAspectRatio: container ? (container.clientWidth / container.clientHeight).toFixed(4) : null,
          width: container ? container.clientWidth : 0,
          height: container ? container.clientHeight : 0,
        },
        section: {
          height: section ? section.clientHeight : 0,
        }
      };
    });

    // Capture screenshots
    const sectionShotName = `the_craft_${vp.name}_section.png`;
    const sectionShotPath = path.join(ARTIFACTS_DIR, sectionShotName);
    await sectionLocator.screenshot({ path: sectionShotPath });
    console.log(`Saved section screenshot: ${sectionShotPath}`);

    const viewportShotName = `the_craft_${vp.name}_viewport.png`;
    const viewportShotPath = path.join(ARTIFACTS_DIR, viewportShotName);
    await page.screenshot({ path: viewportShotPath });
    console.log(`Saved viewport screenshot: ${viewportShotPath}`);

    // Detail crop of image
    const imgShotName = `the_craft_${vp.name}_photo.png`;
    const imgShotPath = path.join(ARTIFACTS_DIR, imgShotName);
    await craftImg.screenshot({ path: imgShotPath });
    console.log(`Saved photo crop: ${imgShotPath}`);

    results[vp.name] = {
      viewport: vp,
      containerBox,
      imgBox,
      textBox,
      sectionBox,
      metrics,
      screenshots: {
        section: sectionShotPath,
        viewport: viewportShotPath,
        photo: imgShotPath,
      }
    };

    console.log(`Dimensions for ${vp.name}:`);
    console.log(`- Container Box: width = ${containerBox ? containerBox.width.toFixed(1) : 'N/A'}px, height = ${containerBox ? containerBox.height.toFixed(1) : 'N/A'}px`);
    console.log(`- Container Aspect Ratio: ${(containerBox.width / containerBox.height).toFixed(4)} (Target: 5/6 = ${(5/6).toFixed(4)})`);
    console.log(`- Max Width check (<= 470px on desktop): ${vp.isMobile ? 'N/A (mobile)' : containerBox.width <= 470.5}`);
    console.log(`- Max Height check (<= 560px on desktop): ${vp.isMobile ? 'N/A (mobile)' : containerBox.height <= 560.5}`);
    console.log(`- Horizontal Overflow: ${metrics.hasHorizontalOverflow} (scrollWidth=${metrics.scrollWidth}, clientWidth=${metrics.clientWidth})`);
    console.log(`- Text before image: ${metrics.textBeforeImg}`);
    console.log(`- Object Fit: ${metrics.img.objectFit}, Position: ${metrics.img.objectPosition}`);

    await context.close();
  }

  // Untouched Section Verification: Homepage Hero
  console.log('\n=== Untouched Section Verification: Homepage Hero ===');
  const homeCtx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await homeCtx.route('**/*resdiary*/**', route => route.abort('blockedbyclient'));
  const homePage = await homeCtx.newPage();
  await homePage.goto(`${BASE_URL}/en`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  const homeEnterBtn = homePage.locator('button[aria-label="Enter GEMA website"]');
  if (await homeEnterBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
    await homeEnterBtn.click();
    await homeEnterBtn.waitFor({ state: 'detached', timeout: 5000 }).catch(() => {});
  }
  const homeContent = await homePage.content();
  const homeHasOpenKitchen = homeContent.includes('home-hero-open-kitchen.jpg');
  console.log('Homepage contains authentic hero photography (home-hero-open-kitchen.jpg):', homeHasOpenKitchen);
  await homeCtx.close();

  // Untouched Section Verification: Day to Night
  console.log('\n=== Untouched Section Verification: Day to Night ===');
  const expCtx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await expCtx.route('**/*resdiary*/**', route => route.abort('blockedbyclient'));
  const expPage = await expCtx.newPage();
  await expPage.goto(`${BASE_URL}/en/experience`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  const expEnterBtn = expPage.locator('button[aria-label="Enter GEMA website"]');
  if (await expEnterBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
    await expEnterBtn.click();
    await expEnterBtn.waitFor({ state: 'detached', timeout: 5000 }).catch(() => {});
  }
  const expContent = await expPage.content();
  const hasDayToNight = expContent.includes('Day to Night');
  console.log('Experience page contains Day to Night:', hasDayToNight);
  await expCtx.close();

  await browser.close();

  fs.writeFileSync(
    path.join(ARTIFACTS_DIR, 'qa_018f_results.json'),
    JSON.stringify(results, null, 2)
  );
  console.log('\nAll QA results written to qa_018f_results.json');
}

runQA().catch((err) => {
  console.error('QA Failed:', err);
  process.exit(1);
});
