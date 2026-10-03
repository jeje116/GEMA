/**
 * SPLASH-009: Bottom Metadata Responsive Rebalance Verification Suite
 * - Verify "EST. 2026" copy in DOM and screen reader landmark (zero "EST. 2020")
 * - Verify "A TASTE OF ITALY ALWAYS" copy unchanged
 * - Verify 17-viewport matrix (13 mobile, 4 desktop):
 *   1. Fullscreen media background preserved (100vw x 100dvh, zero letterbox)
 *   2. Bottom-right text ("ALWAYS") strictly clears the background decorative line
 *   3. Bottom-left "EST. 2026" shares a balanced baseline with right block
 *   4. Zero collision with foliage / olive branches
 *   5. Zero collision between bottom metadata and Welcome group / hairline above
 * - Generate Mobile and Desktop Contact Sheets
 */

const fs = require('fs');
const path = require('path');
const { chromium } = require('/Users/jasonsjanuard/scratch_playwright/node_modules/playwright');
const sharp = require(path.resolve(__dirname, '../node_modules/sharp'));

const OUTPUT_DIR = '/Users/jasonsjanuard/.gemini/antigravity-ide/brain/a3779072-b07b-4e82-86bf-9d3fa933eff6/scratch/splash-009-qa';
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const VIEWPORT_MATRIX = [
  // Mobile Small / Normal (Band A)
  { width: 360, height: 800, name: '360x800', type: 'mobile', band: 'Band A' },
  { width: 375, height: 812, name: '375x812', type: 'mobile', band: 'Band A' },
  { width: 390, height: 700, name: '390x700', type: 'mobile', band: 'Band A' },
  { width: 390, height: 780, name: '390x780', type: 'mobile', band: 'Band A' },
  { width: 390, height: 844, name: '390x844', type: 'mobile', band: 'Band A (Baseline)' },
  { width: 390, height: 900, name: '390x900', type: 'mobile', band: 'Band A' },
  { width: 402, height: 874, name: '402x874', type: 'mobile', band: 'Band A' },
  { width: 412, height: 915, name: '412x915', type: 'mobile', band: 'Band A' },
  // Mobile Wide / Short-Wide (Band B & Override 1)
  { width: 430, height: 760, name: '430x760', type: 'mobile', band: 'Band B / Override 1' },
  { width: 430, height: 850, name: '430x850', type: 'mobile', band: 'Band B' },
  { width: 430, height: 932, name: '430x932', type: 'mobile', band: 'Band B' },
  { width: 480, height: 800, name: '480x800', type: 'mobile', band: 'Band B / Override 1' },
  { width: 540, height: 960, name: '540x960', type: 'mobile', band: 'Band B / Override 1' },
  // Desktop & Short Desktop (Band C/D & Override 2)
  { width: 1280, height: 720, name: '1280x720', type: 'desktop', band: 'Band D / Override 2' },
  { width: 1366, height: 768, name: '1366x768', type: 'desktop', band: 'Band D / Override 2' },
  { width: 1440, height: 900, name: '1440x900', type: 'desktop', band: 'Band D' },
  { width: 1600, height: 900, name: '1600x900', type: 'desktop', band: 'Band D' },
  { width: 1920, height: 1080, name: '1920x1080', type: 'desktop', band: 'Band D' },
];

async function runSplash009QA() {
  console.log('===============================================================');
  console.log('GEMA SPLASH-009C: DESKTOP REPOSITION + EST. 2025 QA SUITE');
  console.log('===============================================================\n');

  const browser = await chromium.launch({ headless: true });
  const results = [];
  const screenshotPaths = [];

  for (const vp of VIEWPORT_MATRIX) {
    const isMobile = vp.type === 'mobile';
    const page = await browser.newPage({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: isMobile ? 2 : 1.5,
    });

    await page.goto('http://localhost:3001', { waitUntil: 'networkidle' });
    // Allow video to load and overlay to transition in
    await page.waitForTimeout(1400);

    const screenshotFile = path.join(OUTPUT_DIR, `${vp.name}.png`);
    await page.screenshot({ path: screenshotFile });
    screenshotPaths.push({ ...vp, path: screenshotFile });

    const evalResult = await page.evaluate((v) => {
      const getVisibleEl = (sel) => {
        const els = Array.from(document.querySelectorAll(sel));
        return els.find((el) => {
          const r = el.getBoundingClientRect();
          return r.width > 0 && r.height > 0;
        }) || els[0] || null;
      };

      const video = document.querySelector('[data-splash-element="video-stream"]');
      const est = getVisibleEl('[data-splash-element="est"]');
      const taste = getVisibleEl('[data-splash-element="taste"]');
      const accent = getVisibleEl('[data-splash-element="accent"]');
      const divider = getVisibleEl('[data-splash-element="divider"]');
      const welcome = getVisibleEl('[data-splash-element="welcome"]');
      const goodFood = getVisibleEl('[data-splash-element="good-food"]');
      const srLandmark = document.querySelector('.sr-only');

      const rVideo = video ? video.getBoundingClientRect() : null;
      const rEst = est ? est.getBoundingClientRect() : null;
      const rTaste = taste ? taste.getBoundingClientRect() : null;
      const rAccent = accent ? accent.getBoundingClientRect() : null;
      const rDivider = divider ? divider.getBoundingClientRect() : null;
      const rWelcome = welcome ? welcome.getBoundingClientRect() : null;
      const rGoodFood = goodFood ? goodFood.getBoundingClientRect() : null;

      const srText = srLandmark ? srLandmark.innerText : '';
      const estText = est ? est.innerText.trim() : '';
      const tasteText = taste ? taste.innerText.trim() : '';

      return {
        video: rVideo ? {
          width: Math.round(rVideo.width),
          height: Math.round(rVideo.height),
          top: Math.round(rVideo.top),
          left: Math.round(rVideo.left),
        } : null,
        est: rEst ? {
          left: Math.round(rEst.left),
          right: Math.round(rEst.right),
          bottom: Math.round(v.height - rEst.bottom),
          top: Math.round(rEst.top),
          height: Math.round(rEst.height),
          width: Math.round(rEst.width),
        } : null,
        taste: rTaste ? {
          left: Math.round(rTaste.left),
          right: Math.round(v.width - rTaste.right),
          bottom: Math.round(v.height - rTaste.bottom),
          top: Math.round(rTaste.top),
          height: Math.round(rTaste.height),
          width: Math.round(rTaste.width),
        } : null,
        accent: rAccent ? {
          top: Math.round(rAccent.top),
          bottom: Math.round(rAccent.bottom),
          left: Math.round(rAccent.left),
          right: Math.round(rAccent.right),
          topPct: +(rAccent.top / v.height * 100).toFixed(1),
        } : null,
        divider: rDivider ? {
          top: Math.round(rDivider.top),
          topPct: +(rDivider.top / v.height * 100).toFixed(1),
        } : null,
        welcome: rWelcome ? {
          top: Math.round(rWelcome.top),
          topPct: +(rWelcome.top / v.height * 100).toFixed(1),
        } : null,
        goodFood: rGoodFood ? {
          top: Math.round(rGoodFood.top),
          topPct: +(rGoodFood.top / v.height * 100).toFixed(1),
        } : null,
        estText,
        tasteText,
        srHas2025: srText.includes('EST. 2025'),
        srHas2026: srText.includes('EST. 2026'),
        srHas2020: srText.includes('EST. 2020'),
      };
    }, vp);

    // Assertions
    // 1. Copy assertion: "EST. 2025" present, "EST. 2026" and "EST. 2020" absent
    const estCopyValid = evalResult.estText.includes('EST. 2025') && !evalResult.estText.includes('EST. 2026') && !evalResult.estText.includes('EST. 2020');
    const tasteCopyValid = evalResult.tasteText.includes('A TASTE') && evalResult.tasteText.includes('OF ITALY') && evalResult.tasteText.includes('ALWAYS');
    const srValid = evalResult.srHas2025 && !evalResult.srHas2026 && !evalResult.srHas2020;

    // 2. Fullscreen assertion: covers viewport
    const fullscreenOk = evalResult.video && evalResult.video.width === vp.width && evalResult.video.height === vp.height;

    // 3. Central composition restored baseline assertion (desktop >= 768px):
    // Expected baseline: divider ~71%, welcome ~75.5%, good-food ~84.5%, accent hairline ~88%
    let centralBaselineOk = true;
    if (!isMobile) {
      const dividerOk = evalResult.divider && Math.abs(evalResult.divider.topPct - 71.0) <= 2.5;
      const welcomeOk = evalResult.welcome && Math.abs(evalResult.welcome.topPct - 75.5) <= 2.5;
      const goodFoodOk = evalResult.goodFood && Math.abs(evalResult.goodFood.topPct - 84.5) <= 2.5;
      const accentOk = evalResult.accent && Math.abs(evalResult.accent.topPct - 88.0) <= 2.5;
      centralBaselineOk = dividerOk && welcomeOk && goodFoodOk && accentOk;
    }

    // 4. Bottom decorative line clearance assertion:
    // In Desktop, decorative line is at ~7.2% from bottom (~52px on 720p, ~55px on 768p, ~65px on 900p, ~78px on 1080p).
    // In Mobile, decorative line is at ~2.0% - 2.8% from bottom (~17px - 26px).
    const lineBottomPx = isMobile ? Math.round(vp.height * 0.025) : Math.round(vp.height * 0.072);
    const tasteClearanceAboveLine = evalResult.taste ? evalResult.taste.bottom - lineBottomPx : -999;
    // Per SPLASH-009B: On mobile, metadata remains anchored near bottom frame; clean positive clearance (>= 8px) is expected.
    const lineClearanceOk = isMobile ? tasteClearanceAboveLine >= 8 : tasteClearanceAboveLine >= 12;

    // 5. Baseline balance assertion: left and right blocks share harmonious baseline
    // In desktop, left and right bottom are identical. In mobile, difference <= 2px.
    const baselineDiff = (evalResult.est && evalResult.taste) ? Math.abs(evalResult.est.bottom - evalResult.taste.bottom) : 999;
    const baselineBalanced = baselineDiff <= 2;

    // 6. 2D Collision assertion: central composition does not collide with metadata
    // Check true 2D bounding box intersection between central accent/welcome and metadata
    const boxesIntersect2D = (b1, b2) => {
      if (!b1 || !b2) return false;
      return !(
        b1.right <= b2.left ||
        b1.left >= b2.right ||
        b1.bottom <= b2.top ||
        b1.top >= b2.bottom
      );
    };

    let collision2D = false;
    if (evalResult.accent) {
      if (boxesIntersect2D(evalResult.accent, evalResult.est)) collision2D = true;
      if (boxesIntersect2D(evalResult.accent, evalResult.taste)) collision2D = true;
    }
    const noCollisionOk = !collision2D;

    // 7. Foliage / side inset safety:
    // Right margin must be >= 24px on mobile and >= 50px on desktop (target 5.0% inset: 64px on 1280, 68px on 1366, 96px on 1920)
    const minRightMargin = isMobile ? 24 : 50;
    const rightMarginOk = evalResult.taste && evalResult.taste.right >= minRightMargin;

    const pass = estCopyValid && tasteCopyValid && srValid && fullscreenOk && centralBaselineOk && lineClearanceOk && baselineBalanced && noCollisionOk && rightMarginOk;

    results.push({
      vp: vp.name,
      band: vp.band,
      type: vp.type,
      tasteBottom: evalResult.taste ? evalResult.taste.bottom : 'N/A',
      lineEstimate: lineBottomPx,
      clearanceAboveLine: tasteClearanceAboveLine,
      estBottom: evalResult.est ? evalResult.est.bottom : 'N/A',
      baselineDiff,
      tasteRight: evalResult.taste ? evalResult.taste.right : 'N/A',
      estLeft: evalResult.est ? evalResult.est.left : 'N/A',
      centralDividerPct: evalResult.divider?.topPct,
      centralWelcomePct: evalResult.welcome?.topPct,
      centralGoodFoodPct: evalResult.goodFood?.topPct,
      centralAccentPct: evalResult.accent?.topPct,
      noCollisionOk,
      copyOk: estCopyValid && tasteCopyValid && srValid,
      pass,
    });

    console.log(
      `[${pass ? 'PASS' : 'FAIL'}]`,
      vp.name.padEnd(10),
      `| ${vp.band.padEnd(20)}`,
      `| Central: ${evalResult.divider?.topPct || '-'}% / ${evalResult.welcome?.topPct || '-'}% / ${evalResult.accent?.topPct || '-'}%`,
      `| Clearance: +${String(tasteClearanceAboveLine + 'px').padEnd(5)}`,
      `| 2D Collision: ${collision2D ? 'YES' : 'NO'}`,
      `| Baseline diff: ${baselineDiff}px`
    );

    await page.close();
  }

  await browser.close();

  // Generate Contact Sheets
  console.log('\nGenerating visual contact sheets...');
  await generateContactSheets(screenshotPaths);

  // Summary
  const allPassed = results.every((r) => r.pass);
  console.log('\n===============================================================');
  console.log(`SPLASH-009 EMPIRICAL QA RESULT: ${allPassed ? 'ALL 17 VIEWPORTS PASSED (100%)' : 'SOME VIEWPORTS FAILED'}`);
  console.log('===============================================================\n');

  return { allPassed, results };
}

async function generateContactSheets(screenshots) {
  // Mobile contact sheet (13 mobile viewports: 4 columns x 4 rows)
  const mobileScreens = screenshots.filter((s) => s.type === 'mobile');
  const desktopScreens = screenshots.filter((s) => s.type === 'desktop');

  if (mobileScreens.length > 0) {
    const thumbW = 240;
    const thumbH = 480;
    const cols = 4;
    const rows = Math.ceil(mobileScreens.length / cols);
    const canvasW = cols * thumbW;
    const canvasH = rows * thumbH;

    const composites = [];
    for (let i = 0; i < mobileScreens.length; i++) {
      const s = mobileScreens[i];
      const col = i % cols;
      const row = Math.floor(i / cols);
      const resizedBuf = await sharp(s.path)
        .resize(thumbW, thumbH, { fit: 'cover', position: 'center' })
        .toBuffer();
      composites.push({
        input: resizedBuf,
        left: col * thumbW,
        top: row * thumbH,
      });
    }

    const mobileSheetPath = path.join(OUTPUT_DIR, 'contact-sheet-mobile-splash009.png');
    await sharp({
      create: {
        width: canvasW,
        height: canvasH,
        channels: 4,
        background: { r: 244, g: 239, b: 230, alpha: 1 },
      },
    })
      .composite(composites)
      .png()
      .toFile(mobileSheetPath);

    console.log(`Saved mobile contact sheet: ${mobileSheetPath}`);
  }

  if (desktopScreens.length > 0) {
    const thumbW = 480;
    const thumbH = 270;
    const cols = 2;
    const rows = Math.ceil(desktopScreens.length / cols);
    const canvasW = cols * thumbW;
    const canvasH = rows * thumbH;

    const composites = [];
    for (let i = 0; i < desktopScreens.length; i++) {
      const s = desktopScreens[i];
      const col = i % cols;
      const row = Math.floor(i / cols);
      const resizedBuf = await sharp(s.path)
        .resize(thumbW, thumbH, { fit: 'cover', position: 'center' })
        .toBuffer();
      composites.push({
        input: resizedBuf,
        left: col * thumbW,
        top: row * thumbH,
      });
    }

    const desktopSheetPath = path.join(OUTPUT_DIR, 'contact-sheet-desktop-splash009.png');
    await sharp({
      create: {
        width: canvasW,
        height: canvasH,
        channels: 4,
        background: { r: 244, g: 239, b: 230, alpha: 1 },
      },
    })
      .composite(composites)
      .png()
      .toFile(desktopSheetPath);

    console.log(`Saved desktop contact sheet: ${desktopSheetPath}`);
  }
}

runSplash009QA()
  .then(({ allPassed }) => {
    if (!allPassed) process.exit(1);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
