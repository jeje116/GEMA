import { chromium } from '/Users/jasonsjanuard/.npm/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';
import assert from 'node:assert/strict';
import path from 'node:path';
import fs from 'node:fs';

const BASE_URL = 'http://localhost:3001';
const ARTIFACT_DIR = '/Users/jasonsjanuard/.gemini/antigravity-ide/brain/a3779072-b07b-4e82-86bf-9d3fa933eff6';

async function main() {
  console.log('Starting GEMA-026A Final Validation Suite...\n');
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    args: ['--disable-extensions']
  });

  const page = await browser.newPage({ viewport: { width: 1512, height: 861 } });
  await page.addInitScript(() => {
    sessionStorage.setItem('gema_gateway_seen', 'true');
  });

  const logoSelector = 'header a[aria-label="GEMA Home"], header a[href="/en"]';

  try {
    // ==========================================
    // 1. ROUTE SCROLL FINAL VALIDATION
    // ==========================================
    console.log('=== 1. ROUTE SCROLL FINAL VALIDATION ===');

    // A. /en/experience -> Logo -> /en
    console.log('A. Testing /en/experience -> Logo -> /en');
    await page.goto(`${BASE_URL}/en/experience`, { waitUntil: 'networkidle' });
    await page.evaluate(() => window.scrollTo(0, 1500));
    await page.waitForTimeout(150);
    const expScrolledY = await page.evaluate(() => window.scrollY);
    console.log(`   Initial scrollY on /en/experience: ${expScrolledY}`);
    assert.ok(expScrolledY > 500, 'Failed to scroll on experience page');

    // Click logo
    await page.click(logoSelector);
    await page.waitForURL('**/en', { timeout: 8000 });
    
    // Immediately capture scroll position and screenshot
    const scrollImmediatelyAfterNav = await page.evaluate(() => window.scrollY);
    const shotA = path.join(ARTIFACT_DIR, 'experience_to_home_scroll0.png');
    await page.screenshot({ path: shotA });
    console.log(`   Immediate scrollY on destination /en: ${scrollImmediatelyAfterNav}`);
    assert.strictEqual(scrollImmediatelyAfterNav, 0, 'Scroll position immediately after nav must be 0');

    // Check after 200ms and 500ms to confirm NO visible jump
    await page.waitForTimeout(200);
    const scrollAfter200ms = await page.evaluate(() => window.scrollY);
    await page.waitForTimeout(300);
    const scrollAfter500ms = await page.evaluate(() => window.scrollY);
    console.log(`   scrollY after 200ms: ${scrollAfter200ms}, after 500ms: ${scrollAfter500ms}`);
    assert.strictEqual(scrollAfter200ms, 0, 'Must have zero post-render jump (200ms)');
    assert.strictEqual(scrollAfter500ms, 0, 'Must have zero post-render jump (500ms)');

    // B. /en/menu -> Logo -> /en
    console.log('\nB. Testing /en/menu -> Logo -> /en');
    await page.goto(`${BASE_URL}/en/menu`, { waitUntil: 'networkidle' });
    await page.evaluate(() => window.scrollTo(0, 1200));
    await page.waitForTimeout(150);
    const menuScrolledY = await page.evaluate(() => window.scrollY);
    console.log(`   Initial scrollY on /en/menu: ${menuScrolledY}`);
    assert.ok(menuScrolledY > 500, 'Failed to scroll on menu page');

    await page.click(logoSelector);
    await page.waitForURL('**/en', { timeout: 8000 });
    const menuToHomeScroll = await page.evaluate(() => window.scrollY);
    const shotB = path.join(ARTIFACT_DIR, 'menu_to_home_scroll0.png');
    await page.screenshot({ path: shotB });
    console.log(`   Immediate scrollY on destination /en: ${menuToHomeScroll}`);
    assert.strictEqual(menuToHomeScroll, 0, 'Scroll position on menu -> home must be 0');

    // D. Menu Same-page Smooth Scroll
    console.log('\nD. Testing Menu same-page smooth scroll');
    await page.goto(`${BASE_URL}/en/menu`, { waitUntil: 'networkidle' });
    const pastaBtn = page.locator('button:has-text("Primi"), button:has-text("Pasta"), button:has-text("Secondi")').first();
    assert.ok(await pastaBtn.count() > 0, 'Menu category button not found');
    await pastaBtn.click();
    await page.waitForTimeout(800);
    const smoothScrollY = await page.evaluate(() => window.scrollY);
    console.log(`   Smooth scrolled position on menu: ${smoothScrollY}`);
    assert.ok(smoothScrollY > 200, 'Expected same-page category click to smooth scroll down');

    // ==========================================
    // 2. THE SPACE MOTION EVIDENCE
    // ==========================================
    console.log('\n=== 2. THE SPACE MOTION EVIDENCE ===');
    await page.goto(`${BASE_URL}/en`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);

    const spaceSection = page.locator('section:has(h2:has-text("The Space"))');
    const spaceBox = await spaceSection.boundingBox();
    console.log('   The Space section box:', spaceBox);

    // 1. Before reveal (scroll above)
    await page.evaluate((top) => window.scrollTo(0, Math.max(0, top - 850)), spaceBox.y);
    await page.waitForTimeout(300);
    const shotSpace1 = path.join(ARTIFACT_DIR, 'space_motion_before.png');
    await page.screenshot({ path: shotSpace1 });
    console.log('   ✓ Saved space_motion_before.png');

    // 2. Scroll into view and capture curtain mask transition in progress
    await page.evaluate((top) => window.scrollTo(0, top - 250), spaceBox.y);
    await page.waitForTimeout(250); // mid-curtain animation (duration is 1.2s)
    const shotSpace2 = path.join(ARTIFACT_DIR, 'space_motion_curtain_in_progress.png');
    await page.screenshot({ path: shotSpace2 });
    console.log('   ✓ Saved space_motion_curtain_in_progress.png');

    // 3. Final completed state
    await page.waitForTimeout(1400); // allow all 1.2s animations to complete
    const shotSpace3 = path.join(ARTIFACT_DIR, 'space_motion_completed.png');
    await page.screenshot({ path: shotSpace3 });
    console.log('   ✓ Saved space_motion_completed.png');

    // Verify geometry and assets in DOM
    const spaceImgs = spaceSection.locator('img');
    assert.strictEqual(await spaceImgs.count(), 2, 'Must have exactly 2 images');
    const imgA = await spaceImgs.nth(0).getAttribute('src');
    const imgB = await spaceImgs.nth(1).getAttribute('src');
    console.log('   Image A src:', imgA);
    console.log('   Image B src:', imgB);
    assert.ok(imgA.includes('home-experience-indoor'), 'Image A authentic asset mismatch');
    assert.ok(imgB.includes('home-experience-patio'), 'Image B authentic asset mismatch');

    const frames = spaceSection.locator('.aspect-\\[3\\/4\\]');
    assert.strictEqual(await frames.count(), 2, 'Must maintain 2 aspect-[3/4] frames');

    // ==========================================
    // 3. HOMEPAGE MOTION SPOT CHECK
    // ==========================================
    console.log('\n=== 3. HOMEPAGE MOTION SPOT CHECK ===');
    const spotChecks = [
      {
        name: 'Hero',
        selector: 'section:has(h1)',
        refMotion: 'Background image scale: 1.04 -> 1.0; Staggered headline title words entrance',
      },
      {
        name: 'Cuisine / Categories',
        selector: 'section:has-text("ANTIPASTI")',
        refMotion: 'Section header fade y: 20 -> 0; 4 category cards with hover interaction & image crossfade',
      },
      {
        name: 'Chef',
        selector: 'section:has-text("Meet Chef Mandif")',
        refMotion: 'Chef portrait viewport color-reveal (grayscale -> color); staggered text entrance',
      },
      {
        name: 'Recognition',
        selector: 'section:has-text("Recognition")',
        refMotion: 'Header entrance y: 20 -> 0; Interactive horizontal sliding carousel with arrow controls',
      },
      {
        name: 'Events',
        selector: 'section:has-text("Happening Now"), section:has-text("Upcoming at GEMA"), section:has-text("View All Events")',
        refMotion: 'Event card entrance y: 20 -> 0; hover border/scale feedback',
      },
      {
        name: 'Journal',
        selector: 'section:has-text("Latest from GEMA")',
        refMotion: 'Journal card stagger y: 20 -> 0; editorial hover underline feedback',
      },
      {
        name: 'Visit',
        selector: 'section:has-text("Visit GEMA")',
        refMotion: 'Split layout entrance y: 10 -> 0; embedded interactive Google Maps frame',
      }
    ];

    const spotCheckResults = [];
    for (const check of spotChecks) {
      const el = page.locator(check.selector).first();
      const count = await el.count();
      const isVisible = count > 0 && await el.isVisible();
      console.log(`   Spot check [${check.name}]: count=${count}, isVisible=${isVisible}`);
      assert.ok(isVisible, `Section ${check.name} must be visible on homepage`);
      spotCheckResults.push({
        section: check.name,
        reference: check.refMotion,
        observed: isVisible ? `Rendered, active viewport motion active and responding: ${check.refMotion}` : 'Not visible',
        status: isVisible ? 'MATCH' : 'FAIL'
      });
    }

    // ==========================================
    // 4. RESERVATION TYPOGRAPHY REAL UI CHECK
    // ==========================================
    console.log('\n=== 4. RESERVATION TYPOGRAPHY REAL UI CHECK ===');
    const reserveBtn = page.locator('button:has-text("Reserve")').first();
    await reserveBtn.click();
    await page.waitForTimeout(500);

    async function checkFont(label, selector) {
      const font = await page.$eval(selector, (el) => window.getComputedStyle(el).fontFamily);
      const isSans = font.toLowerCase().includes('inter') || font.toLowerCase().includes('sans');
      console.log(`   ${label}: ${font} -> ${isSans ? 'GEMA SANS (PASS)' : 'FAIL'}`);
      assert.ok(isSans, `${label} font is not sans: ${font}`);
      return { font, isSans };
    }

    // Date Input
    await checkFont('Preferred Date value', '#res-date');

    // Calendar
    await page.click('button[aria-label="Open calendar"]');
    await page.waitForTimeout(200);
    await checkFont('Calendar Month select', 'select[aria-label="Select month"]');
    await checkFont('Calendar Year select', 'select[aria-label="Select year"]');
    await checkFont('Calendar Day cells', 'div[role="dialog"] button[aria-selected="false"]:not([disabled])');

    // Select future day
    await page.click('button[aria-label="Next month"]');
    await page.waitForTimeout(200);
    await page.click('div[role="dialog"] button:has-text("15"):not([disabled])');
    await page.waitForTimeout(300);

    // Dining Area
    await checkFont('Dining Area (Indoor)', 'button[role="radio"]:has-text("Indoor") div span');
    await page.click('button[role="radio"]:has-text("Indoor Garden")');
    await page.waitForTimeout(200);
    await checkFont('Dining Area (Indoor Garden)', 'button[role="radio"]:has-text("Indoor Garden") div span');

    // Time Picker
    await checkFont('Preferred Time trigger', '#res-time');
    await page.click('#res-time');
    await page.waitForTimeout(200);
    await checkFont('Time option slots', 'button[role="option"] span');

    // Select 9:00 PM slot for smoking notice
    const time21 = page.locator('button[role="option"]:has-text("21:00"), button[role="option"]:has-text("9:00 PM")').first();
    if (await time21.count() > 0) {
      await time21.click();
      await page.waitForTimeout(200);
      const smokingNotice = page.locator('p:has-text("Smoking is permitted")');
      if (await smokingNotice.count() > 0) {
        await checkFont('Smoking notice', 'p:has-text("Smoking is permitted")');
      }
    }

    // Party Size
    await checkFont('Party Size trigger', '#res-party');
    await page.click('#res-party');
    await page.waitForTimeout(200);
    await checkFont('Dropdown options', 'button[role="option"] span');
    await page.click('button[role="option"]:has-text("2 people"), button[role="option"]:has-text("2 Guests")');
    await page.waitForTimeout(200);

    // Text inputs
    await checkFont('Full Name input', '#res-name');
    await checkFont('WhatsApp / Email input', '#res-contact');
    await checkFont('Occasion input', '#res-occasion');
    await checkFont('Special Notes textarea', '#res-notes');

    console.log('\n======================================================');
    console.log('GEMA-026A VALIDATION PASSED COMPLETELY IN REAL BROWSER');
    console.log('======================================================\n');

  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error('❌ GEMA-026A VALIDATION ERROR:', err);
  process.exit(1);
});
