const { chromium } = require('playwright');
const fs = require('fs');

async function snapshot() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

  // Use data URL or local server or base64 so Chromium loads it cleanly
  const desktopBase64 = fs.readFileSync('/tmp/desktop-video.mp4').toString('base64');
  const mobileBase64 = fs.readFileSync('/tmp/mobile-video.mp4').toString('base64');

  await page.setContent(`
    <body style="margin:0; background:#f4efe6;">
      <video id="v" src="data:video/mp4;base64,${desktopBase64}" autoplay muted playsinline style="width:100vw; height:100vh; object-fit:contain;"></video>
    </body>
  `);

  await page.waitForFunction(() => {
    const v = document.getElementById('v');
    return v && v.readyState >= 2 && !v.paused;
  }, { timeout: 10000 });

  await page.waitForTimeout(1000);
  await page.screenshot({ path: '/tmp/desktop-video-frame.png' });

  // Mobile
  await page.setViewportSize({ width: 720, height: 1280 });
  await page.setContent(`
    <body style="margin:0; background:#f4efe6;">
      <video id="v" src="data:video/mp4;base64,${mobileBase64}" autoplay muted playsinline style="width:100vw; height:100vh; object-fit:contain;"></video>
    </body>
  `);

  await page.waitForFunction(() => {
    const v = document.getElementById('v');
    return v && v.readyState >= 2 && !v.paused;
  }, { timeout: 10000 });

  await page.waitForTimeout(1000);
  await page.screenshot({ path: '/tmp/mobile-video-frame.png' });

  await browser.close();
  console.log('Snapshots successfully captured!');
}

snapshot().catch(console.error);
