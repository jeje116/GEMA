const { chromium } = require('playwright');

async function testVideoPlayback() {
  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
  });

  const urlsToTest = [
    { name: 'Desktop usercontent direct', url: 'https://drive.usercontent.google.com/download?id=19wGXqoFUtY_RIDN2TGkecGKepzQjcTyz&export=download' },
    { name: 'Desktop google uc export', url: 'https://drive.google.com/uc?export=download&id=19wGXqoFUtY_RIDN2TGkecGKepzQjcTyz' },
    { name: 'Mobile usercontent direct', url: 'https://drive.usercontent.google.com/download?id=1uNOiyFIl29En3thRJnntpemLX6r4rJ6o&export=download' },
    { name: 'Mobile google uc export', url: 'https://drive.google.com/uc?export=download&id=1uNOiyFIl29En3thRJnntpemLX6r4rJ6o' },
  ];

  for (const item of urlsToTest) {
    console.log(`\nTesting ${item.name} (${item.url})...`);
    const context = await browser.newContext();
    const page = await context.newPage();

    let videoEvents = [];
    page.on('console', msg => console.log('  [Console]', msg.type(), msg.text()));
    page.on('pageerror', err => console.log('  [PageError]', err.message));

    const html = `
      <!DOCTYPE html>
      <html>
        <body>
          <video id="vid" autoplay muted loop playsinline width="640" height="360" src="${item.url}"></video>
          <script>
            const v = document.getElementById('vid');
            ['loadstart', 'loadedmetadata', 'loadeddata', 'canplay', 'playing', 'error'].forEach(evt => {
              v.addEventListener(evt, () => console.log('Event: ' + evt + ', readyState: ' + v.readyState + ', currentTime: ' + v.currentTime));
            });
            v.addEventListener('error', () => {
              const err = v.error;
              console.log('Video error code: ' + (err ? err.code : 'unknown') + ', message: ' + (err ? err.message : ''));
            });
          </script>
        </body>
      </html>
    `;

    await page.setContent(html);

    // Wait up to 8 seconds and check playback
    let played = false;
    let finalCurrentTime = 0;
    for (let i = 0; i < 16; i++) {
      await page.waitForTimeout(500);
      const state = await page.evaluate(() => {
        const v = document.getElementById('vid');
        return {
          currentTime: v.currentTime,
          paused: v.paused,
          readyState: v.readyState,
          videoWidth: v.videoWidth,
          videoHeight: v.videoHeight,
          error: v.error ? { code: v.error.code, message: v.error.message } : null,
        };
      });

      if (state.currentTime > 0.5 && !state.paused) {
        played = true;
        finalCurrentTime = state.currentTime;
        console.log(`  SUCCESS! Video is playing: currentTime=${state.currentTime.toFixed(2)}s, readyState=${state.readyState}, dimensions=${state.videoWidth}x${state.videoHeight}`);
        break;
      }
      if (state.error) {
        console.log('  FAILED with error:', state.error);
        break;
      }
    }

    if (!played) {
      const finalState = await page.evaluate(() => {
        const v = document.getElementById('vid');
        return {
          currentTime: v.currentTime,
          paused: v.paused,
          readyState: v.readyState,
          networkState: v.networkState,
          error: v.error ? { code: v.error.code, message: v.error.message } : null,
        };
      });
      console.log('  DID NOT PLAY within timeout. Final state:', finalState);
    }

    await context.close();
  }

  await browser.close();
}

testVideoPlayback().catch(console.error);
