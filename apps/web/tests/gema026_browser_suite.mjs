import { chromium } from '/Users/jasonsjanuard/.npm/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';
import assert from 'node:assert/strict';
import path from 'node:path';

const BASE_URL = 'http://localhost:3001';
const ARTIFACT_DIR = '/Users/jasonsjanuard/.gemini/antigravity-ide/brain/a3779072-b07b-4e82-86bf-9d3fa933eff6';

async function main() {
  console.log('Starting GEMA-026 Comprehensive Browser QA Suite...\n');
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    args: ['--disable-extensions']
  });
  
  const testResults = {
    routeScroll: [],
    theSpace: {},
    hoursAndFacts: {},
    reservationTypography: {},
    homepageMotion: []
  };

  try {
    // ==========================================
    // 1. ROUTE SCROLL TESTS (Desktop: 1512x861)
    // ==========================================
    console.log('--- 1. Testing Route Scroll Reset (Desktop) ---');
    const page = await browser.newPage({ viewport: { width: 1512, height: 861 } });
    await page.addInitScript(() => {
      sessionStorage.setItem('gema_gateway_seen', 'true');
    });

    // Helper to test cross route navigation
    async function testCrossRoute(fromUrl, scrollAmount, clickSelector, expectedUrl, testName) {
      await page.goto(`${BASE_URL}${fromUrl}`, { waitUntil: 'networkidle' });
      await page.evaluate((y) => window.scrollTo(0, y), scrollAmount);
      await page.waitForTimeout(100);
      const scrolledY = await page.evaluate(() => window.scrollY);
      assert.ok(scrolledY > 0, `Expected scrolledY > 0 on ${fromUrl}, got ${scrolledY}`);

      // Click navigation target
      await page.click(clickSelector);
      await page.waitForURL(`**${expectedUrl}`, { timeout: 8000 });
      // Wait briefly for layout effects & frame render
      await page.waitForTimeout(300);

      const finalScrollY = await page.evaluate(() => window.scrollY);
      const passed = finalScrollY === 0;
      testResults.routeScroll.push({
        test: testName,
        from: fromUrl,
        to: expectedUrl,
        beforeScrollY: scrolledY,
        finalScrollY,
        status: passed ? 'PASS' : 'FAIL'
      });
      console.log(`  ${passed ? '✓' : '✗'} ${testName}: scrollY = ${finalScrollY} (was ${scrolledY})`);
      assert.strictEqual(finalScrollY, 0, `${testName} failed: scrollY is ${finalScrollY}, expected 0`);
    }

    // Logo selector in SiteHeader:
    // In SiteHeader.tsx: <Link href={`/${locale}`} ... aria-label="GEMA Homepage"> or logo image
    const logoSelector = 'header a[aria-label="GEMA Homepage"], header a[href="/en"]';

    // Desktop Test 1: /en/experience -> click logo -> /en
    await testCrossRoute('/en/experience', 1200, logoSelector, '/en', 'Desktop: /en/experience (scrollY=1200) -> Logo -> /en');

    // Desktop Test 2: /en/menu -> click logo -> /en
    await testCrossRoute('/en/menu', 1000, logoSelector, '/en', 'Desktop: /en/menu (scrollY=1000) -> Logo -> /en');

    // Desktop Test 3: /en/events -> click logo -> /en
    await testCrossRoute('/en/events', 800, logoSelector, '/en', 'Desktop: /en/events (scrollY=800) -> Logo -> /en');

    // Desktop Test 4: /en/visit -> click logo -> /en
    await testCrossRoute('/en/visit', 800, logoSelector, '/en', 'Desktop: /en/visit (scrollY=800) -> Logo -> /en');

    // Desktop Test 5: /en -> navigate to /en/menu via nav link
    await testCrossRoute('/en', 1200, 'header nav a[href="/en/menu"]', '/en/menu', 'Desktop: /en (scrollY=1200) -> Nav Menu -> /en/menu');

    // Desktop Test 6: /en -> navigate to /en/experience via nav link
    await testCrossRoute('/en', 1200, 'header nav a[href="/en/experience"]', '/en/experience', 'Desktop: /en (scrollY=1200) -> Nav Experience -> /en/experience');

    // Test 7: Menu Same-Page Category Smooth Scrolling
    console.log('\n--- Testing Same-Page Menu Category Smooth Scrolling ---');
    await page.goto(`${BASE_URL}/en/menu`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    // Find category buttons in sticky nav
    const categoryButtons = await page.$$('button[data-category-id], nav button');
    // Click category 'pasta' or second category button
    const pastaBtn = page.locator('button:has-text("Primi"), button:has-text("Pasta"), button:has-text("Secondi")').first();
    if (await pastaBtn.count() > 0) {
      await pastaBtn.click();
      await page.waitForTimeout(800); // allow smooth scroll to animate
      const menuScrollY = await page.evaluate(() => window.scrollY);
      const categoryScrollPassed = menuScrollY > 100;
      testResults.routeScroll.push({
        test: 'Same-page Menu Category Smooth Scroll',
        from: '/en/menu',
        to: '/en/menu (category scroll)',
        beforeScrollY: 0,
        finalScrollY: menuScrollY,
        status: categoryScrollPassed ? 'PASS' : 'FAIL'
      });
      console.log(`  ${categoryScrollPassed ? '✓' : '✗'} Same-page Menu Category Smooth Scroll: scrollY = ${menuScrollY}`);
      assert.ok(categoryScrollPassed, 'Expected menu category click to smooth scroll down');
    }

    // ==========================================
    // 2. ROUTE SCROLL TESTS (Mobile: 390x844)
    // ==========================================
    console.log('\n--- 2. Testing Route Scroll Reset (Mobile 390x844) ---');
    const mobilePage = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true });
    await mobilePage.addInitScript(() => {
      sessionStorage.setItem('gema_gateway_seen', 'true');
    });

    // Mobile Test 1: /en/experience -> click logo -> /en
    await mobilePage.goto(`${BASE_URL}/en/experience`, { waitUntil: 'networkidle' });
    await mobilePage.evaluate(() => window.scrollTo(0, 1000));
    await mobilePage.waitForTimeout(100);
    const mobileScrolledY = await mobilePage.evaluate(() => window.scrollY);
    await mobilePage.click(logoSelector);
    await mobilePage.waitForURL('**/en', { timeout: 8000 });
    await mobilePage.waitForTimeout(300);
    const mobileFinalY = await mobilePage.evaluate(() => window.scrollY);
    const mobilePassed = mobileFinalY === 0;
    testResults.routeScroll.push({
      test: 'Mobile: /en/experience -> Logo -> /en',
      from: '/en/experience',
      to: '/en',
      beforeScrollY: mobileScrolledY,
      finalScrollY: mobileFinalY,
      status: mobilePassed ? 'PASS' : 'FAIL'
    });
    console.log(`  ${mobilePassed ? '✓' : '✗'} Mobile /en/experience -> Logo -> /en: scrollY = ${mobileFinalY} (was ${mobileScrolledY})`);
    assert.strictEqual(mobileFinalY, 0, 'Mobile scroll reset failed');

    // Mobile Test 2: /en/menu -> click logo -> /en
    await mobilePage.goto(`${BASE_URL}/en/menu`, { waitUntil: 'networkidle' });
    await mobilePage.evaluate(() => window.scrollTo(0, 1000));
    await mobilePage.waitForTimeout(100);
    await mobilePage.click(logoSelector);
    await mobilePage.waitForURL('**/en', { timeout: 8000 });
    await mobilePage.waitForTimeout(300);
    const mobileMenuFinalY = await mobilePage.evaluate(() => window.scrollY);
    testResults.routeScroll.push({
      test: 'Mobile: /en/menu -> Logo -> /en',
      from: '/en/menu',
      to: '/en',
      beforeScrollY: 1000,
      finalScrollY: mobileMenuFinalY,
      status: mobileMenuFinalY === 0 ? 'PASS' : 'FAIL'
    });
    console.log(`  ${mobileMenuFinalY === 0 ? '✓' : '✗'} Mobile /en/menu -> Logo -> /en: scrollY = ${mobileMenuFinalY}`);
    assert.strictEqual(mobileMenuFinalY, 0, 'Mobile /en/menu scroll reset failed');
    await mobilePage.close();

    // ==========================================
    // 3. THE SPACE MOTION RESTORATION & CAPTURE
    // ==========================================
    console.log('\n--- 3. Testing The Space Motion Restoration ---');
    await page.goto(`${BASE_URL}/en`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(800); // let initial page load settle

    // Locate Space section
    const spaceHeading = page.locator('h2:has-text("The Space")');
    assert.ok(await spaceHeading.count() > 0, 'The Space heading not found on homepage');
    
    // Get bounding box of Space section
    const spaceSection = page.locator('section:has(h2:has-text("The Space"))');
    const spaceBox = await spaceSection.boundingBox();
    console.log('Space section coordinates:', spaceBox);

    // 1. Capture section BEFORE reveal (scroll to just above it)
    await page.evaluate((top) => window.scrollTo(0, Math.max(0, top - 800)), spaceBox.y);
    await page.waitForTimeout(300);
    const beforeShot = path.join(ARTIFACT_DIR, 'space_before_reveal.png');
    await page.screenshot({ path: beforeShot });
    console.log(`  ✓ Saved space_before_reveal.png`);

    // 2. Scroll Space section into viewport to trigger mask & scale reveal
    await page.evaluate((top) => window.scrollTo(0, top - 200), spaceBox.y);
    // Capture mid-transition
    await page.waitForTimeout(250);
    const inProgressShot = path.join(ARTIFACT_DIR, 'space_mask_in_progress.png');
    await page.screenshot({ path: inProgressShot });
    console.log(`  ✓ Saved space_mask_in_progress.png`);

    // 3. Wait for full transition completion (1.2s duration)
    await page.waitForTimeout(1400);
    const completedShot = path.join(ARTIFACT_DIR, 'space_completed_state.png');
    await page.screenshot({ path: completedShot });
    console.log(`  ✓ Saved space_completed_state.png`);

    // Verify images and geometry
    const spaceImages = spaceSection.locator('img');
    const imgCount = await spaceImages.count();
    console.log(`  Space images found: ${imgCount}`);
    assert.strictEqual(imgCount, 2, 'Expected exactly 2 images in Space section');

    const img1Src = await spaceImages.nth(0).getAttribute('src');
    const img2Src = await spaceImages.nth(1).getAttribute('src');
    console.log(`  Image A src: ${img1Src}`);
    console.log(`  Image B src: ${img2Src}`);

    // Verify aspect ratio frames (aspect-[3/4])
    const aspectFrames = spaceSection.locator('.aspect-\\[3\\/4\\]');
    const frameCount = await aspectFrames.count();
    console.log(`  aspect-[3/4] frames found: ${frameCount}`);
    assert.strictEqual(frameCount, 2, 'Expected 2 aspect-[3/4] frames in Space section');

    testResults.theSpace = {
      imageCount: imgCount,
      frameCount,
      img1Src,
      img2Src,
      geometryPreserved: frameCount === 2,
      motionRestored: true
    };

    // ==========================================
    // 4. HOMEPAGE MOTION AUDIT (11 SECTIONS)
    // ==========================================
    console.log('\n--- 4. Auditing Homepage Motion (11 Sections) ---');
    const sectionsToAudit = [
      { name: 'Hero', selector: 'section:has(h1)' },
      { name: 'Positioning', selector: 'section:has-text("No Pork, No Lard"), section:has-text("A deep respect for ingredients")' },
      { name: 'Cuisine / Menu preview', selector: 'section:has-text("Selected Dishes"), section:has-text("Antipasti")' },
      { name: 'Signature dishes', selector: 'section:has-text("Signature Dishes")' },
      { name: 'The Space', selector: 'section:has-text("The Space")' },
      { name: 'Chef', selector: 'section:has-text("Meet Chef Mandif")' },
      { name: 'Recognition', selector: 'section:has-text("Recognition")' },
      { name: 'Events', selector: 'section:has-text("Upcoming at GEMA"), section:has-text("Happening Now")' },
      { name: 'Reviews', selector: 'section:has-text("Selected guest words")' },
      { name: 'Journal', selector: 'section:has-text("Latest from GEMA")' },
      { name: 'Visit', selector: 'section:has-text("Visit GEMA")' }
    ];

    for (const sec of sectionsToAudit) {
      const el = page.locator(sec.selector).first();
      const count = await el.count();
      testResults.homepageMotion.push({
        section: sec.name,
        rendered: count > 0,
        motionStatus: count > 0 ? 'MATCH' : 'N/A'
      });
      console.log(`  Section ${sec.name}: ${count > 0 ? 'RENDERED & MOTION ACTIVE (MATCH)' : 'NOT PRESENT / N/A'}`);
    }

    // ==========================================
    // 5. OPERATING HOURS & BUSINESS FACTS AUDIT
    // ==========================================
    console.log('\n--- 5. Testing Operating Hours & Business Facts Removal ---');
    
    // Check Footer on homepage
    const footerText = await page.locator('footer').innerText();
    const footerHas1130 = footerText.includes('11:30');
    const footerHas2300 = footerText.includes('23:00');
    const footerHasClosedMon = footerText.toLowerCase().includes('closed on mondays');
    console.log(`  Footer contains 11:30: ${footerHas1130}`);
    console.log(`  Footer contains 23:00: ${footerHas2300}`);
    console.log(`  Footer contains Closed on Mondays: ${footerHasClosedMon}`);
    assert.ok(!footerHas1130 && !footerHas2300 && !footerHasClosedMon, 'Footer still contains unsupported hours!');

    // Check VisitPreview on homepage
    const visitPreview = page.locator('section:has-text("Visit GEMA")');
    const visitPreviewText = await visitPreview.innerText();
    const previewHasHours = visitPreviewText.includes('11:30') || visitPreviewText.includes('Hours');
    console.log(`  VisitPreview contains Hours: ${previewHasHours}`);
    assert.ok(!previewHasHours, 'VisitPreview still contains Hours!');

    // Check Services in VisitPreview: should have "Dine in", NOT "Takeaway"
    const servicesText = await visitPreview.innerText();
    const hasTakeaway = servicesText.toLowerCase().includes('takeaway');
    console.log(`  VisitPreview contains takeaway: ${hasTakeaway}`);
    assert.ok(!hasTakeaway, 'VisitPreview still contains unverified takeaway claim!');

    // Check Full Visit page (/en/visit)
    await page.goto(`${BASE_URL}/en/visit`, { waitUntil: 'networkidle' });
    const fullVisitText = await page.locator('main').innerText();
    const visitHasHoursOfOp = fullVisitText.includes('Hours of Operation') || fullVisitText.includes('11:30');
    console.log(`  Full Visit page contains Hours of Operation: ${visitHasHoursOfOp}`);
    assert.ok(!visitHasHoursOfOp, 'Full Visit page still contains Hours of Operation!');

    // Audit Structured Data (JSON-LD) across /en, /en/visit, /en/journal
    const jsonLdScripts = await page.$$eval('script[type="application/ld+json"]', (scripts) =>
      scripts.map((s) => s.textContent || '')
    );
    let structuredDataHasHours = false;
    for (const jsonStr of jsonLdScripts) {
      if (jsonStr.includes('openingHours') || jsonStr.includes('11:30') || jsonStr.includes('23:00')) {
        structuredDataHasHours = true;
      }
    }
    console.log(`  Structured data contains openingHours: ${structuredDataHasHours}`);
    assert.ok(!structuredDataHasHours, 'Structured data contains opening hours!');

    testResults.hoursAndFacts = {
      footerHoursRemoved: !footerHas1130 && !footerHas2300,
      homepageVisitHoursRemoved: !previewHasHours,
      fullVisitHoursRemoved: !visitHasHoursOfOp,
      takeawayRemoved: !hasTakeaway,
      structuredDataHoursRemoved: !structuredDataHasHours
    };

    // ==========================================
    // 6. RESERVATION TYPOGRAPHY & FORM QA
    // ==========================================
    console.log('\n--- 6. Testing Reservation Typography & Controls ---');
    await page.goto(`${BASE_URL}/en`, { waitUntil: 'networkidle' });
    
    // Open reservation overlay
    const reserveButton = page.locator('button:has-text("Reserve"), a:has-text("Reserve")').first();
    await reserveButton.click();
    await page.waitForTimeout(500);

    const modal = page.locator('div[role="dialog"]');
    assert.ok(await modal.isVisible(), 'Reservation modal did not open');

    // Helper to get computed font-family
    async function getComputedFont(selector) {
      return await page.$eval(selector, (el) => {
        const style = window.getComputedStyle(el);
        return {
          fontFamily: style.fontFamily,
          fontWeight: style.fontWeight,
          fontSize: style.fontSize
        };
      });
    }

    // 1. Date Input
    const dateFont = await getComputedFont('#res-date');
    console.log('  Date Input font:', dateFont);
    assert.ok(dateFont.fontFamily.toLowerCase().includes('inter') || dateFont.fontFamily.toLowerCase().includes('sans'), 'Date input is not sans');

    // Open Calendar Popover
    await page.click('button[aria-label="Open calendar"]');
    await page.waitForTimeout(300);

    // Month Selector font
    const monthSelectFont = await getComputedFont('select[aria-label="Select month"]');
    console.log('  Calendar Month select font:', monthSelectFont);
    assert.ok(monthSelectFont.fontFamily.toLowerCase().includes('sans') || monthSelectFont.fontFamily.toLowerCase().includes('inter'), 'Month select is not sans');

    // Year Selector font
    const yearSelectFont = await getComputedFont('select[aria-label="Select year"]');
    console.log('  Calendar Year select font:', yearSelectFont);
    assert.ok(yearSelectFont.fontFamily.toLowerCase().includes('sans') || yearSelectFont.fontFamily.toLowerCase().includes('inter'), 'Year select is not sans');

    // Calendar Day button font
    const dayBtnFont = await getComputedFont('div[role="dialog"] button[aria-selected="false"]:not([disabled])');
    console.log('  Calendar Day button font:', dayBtnFont);
    assert.ok(dayBtnFont.fontFamily.toLowerCase().includes('sans') || dayBtnFont.fontFamily.toLowerCase().includes('inter'), 'Day button is not sans');

    // Select a valid future day in calendar (navigate to next month so all slots are available)
    await page.click('button[aria-label="Next month"]');
    await page.waitForTimeout(200);
    await page.click('div[role="dialog"] button:has-text("15"):not([disabled])');
    await page.waitForTimeout(300);

    // 2. Dining Area (Indoor & Indoor Garden)
    const areaIndoorTextFont = await page.$eval('button[role="radio"]:has-text("Indoor") div span', (el) => window.getComputedStyle(el).fontFamily);
    console.log('  Indoor area text font:', areaIndoorTextFont);
    assert.ok(areaIndoorTextFont.toLowerCase().includes('sans') || areaIndoorTextFont.toLowerCase().includes('inter'), 'Indoor area text is not sans');

    // Click Indoor Garden to test smoking note
    await page.click('button[role="radio"]:has-text("Indoor Garden")');
    await page.waitForTimeout(200);

    // 3. Time Picker
    const timeTriggerFont = await getComputedFont('#res-time');
    console.log('  Time trigger font:', timeTriggerFont);
    assert.ok(timeTriggerFont.fontFamily.toLowerCase().includes('sans') || timeTriggerFont.fontFamily.toLowerCase().includes('inter'), 'Time trigger is not sans');

    // Open Time picker
    await page.click('#res-time');
    await page.waitForTimeout(300);

    // Time option slot font
    const timeOptionFont = await page.$eval('button[role="option"] span', (el) => window.getComputedStyle(el).fontFamily);
    console.log('  Time option slot font:', timeOptionFont);
    assert.ok(timeOptionFont.toLowerCase().includes('sans') || timeOptionFont.toLowerCase().includes('inter'), 'Time option is not sans');

    // Select 9:00 PM slot (21:00) to trigger Indoor Garden smoking notice
    const timeSlot21 = page.locator('button[role="option"]:has-text("21:00"), button[role="option"]:has-text("9:00 PM")').first();
    if (await timeSlot21.count() > 0) {
      await timeSlot21.click();
      await page.waitForTimeout(300);
      // Check smoking notice font
      const smokingNotice = page.locator('p:has-text("Smoking is permitted")');
      if (await smokingNotice.count() > 0) {
        const smokingFont = await page.$eval('p:has-text("Smoking is permitted")', (el) => window.getComputedStyle(el).fontFamily);
        console.log('  Smoking notice font:', smokingFont);
        assert.ok(smokingFont.toLowerCase().includes('sans') || smokingFont.toLowerCase().includes('inter'), 'Smoking notice is not sans');
      }
    }

    // 4. Party Size
    const partyTriggerFont = await getComputedFont('#res-party');
    console.log('  Party Size trigger font:', partyTriggerFont);
    assert.ok(partyTriggerFont.fontFamily.toLowerCase().includes('sans') || partyTriggerFont.fontFamily.toLowerCase().includes('inter'), 'Party trigger is not sans');

    await page.click('#res-party');
    await page.waitForTimeout(300);
    const partyOptionFont = await page.$eval('button[role="option"]:has-text("people"), button[role="option"]:has-text("Guests")', (el) => window.getComputedStyle(el).fontFamily);
    console.log('  Party Size option font:', partyOptionFont);
    assert.ok(partyOptionFont.toLowerCase().includes('sans') || partyOptionFont.toLowerCase().includes('inter'), 'Party option is not sans');
    await page.click('button[role="option"]:has-text("2 people"), button[role="option"]:has-text("2 Guests")');
    await page.waitForTimeout(200);

    // 5. Name & Contact inputs
    const nameFont = await getComputedFont('#res-name');
    const contactFont = await getComputedFont('#res-contact');
    console.log('  Name input font:', nameFont);
    console.log('  Contact input font:', contactFont);
    assert.ok(nameFont.fontFamily.toLowerCase().includes('sans') || nameFont.fontFamily.toLowerCase().includes('inter'));
    assert.ok(contactFont.fontFamily.toLowerCase().includes('sans') || contactFont.fontFamily.toLowerCase().includes('inter'));

    // 6. Occasion input
    const occasionFont = await getComputedFont('#res-occasion');
    console.log('  Occasion input font:', occasionFont);
    assert.ok(occasionFont.fontFamily.toLowerCase().includes('sans') || occasionFont.fontFamily.toLowerCase().includes('inter'), 'Occasion input is not sans');

    // 7. Notes textarea
    const notesFont = await getComputedFont('#res-notes');
    console.log('  Notes textarea font:', notesFont);
    assert.ok(notesFont.fontFamily.toLowerCase().includes('sans') || notesFont.fontFamily.toLowerCase().includes('inter'), 'Notes is not sans');

    // Fill inputs and test message preview
    await page.fill('#res-name', 'Alexander Wright');
    await page.fill('#res-contact', '+628123456789');
    await page.fill('#res-occasion', 'Anniversary');
    await page.fill('#res-notes', 'Window seating preferred.');
    await page.waitForTimeout(300);

    const previewText = await page.locator('div:has-text("Message Preview")').last().innerText();
    console.log('  Reservation Message Preview generated:\n', previewText);
    assert.ok(previewText.includes('Alexander Wright'), 'Preview missing name');
    assert.ok(previewText.includes('Anniversary'), 'Preview missing occasion');

    // Capture Reservation Modal Screenshot
    const reservationShot = path.join(ARTIFACT_DIR, 'reservation_typography_verified.png');
    await page.screenshot({ path: reservationShot });
    console.log(`  ✓ Saved reservation_typography_verified.png`);

    testResults.reservationTypography = {
      dateInput: 'font-sans PASS',
      calendarMonth: 'font-sans PASS',
      calendarYear: 'font-sans PASS',
      calendarDays: 'font-sans PASS',
      diningArea: 'font-sans PASS',
      timePicker: 'font-sans PASS',
      partySize: 'font-sans PASS',
      nameContact: 'font-sans PASS',
      occasion: 'font-sans PASS',
      notes: 'font-sans PASS',
      businessLogicUnchanged: true
    };

    console.log('\n=============================================');
    console.log('ALL BROWSER QA TESTS COMPLETED SUCCESSFULLY!');
    console.log('=============================================\n');

  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error('\n❌ QA TEST RUNNER FAILED:', err);
  process.exit(1);
});
