const { chromium } = require('/Users/jasonsjanuard/scratch_playwright/node_modules/playwright');

async function diagnose() {
  console.log('--- STARTING EMPIRICAL SPLASH DIAGNOSIS ---');
  const browser = await chromium.launch({ headless: true });
  
  // Test Desktop
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();

  const networkEvents = [];
  page.on('request', req => {
    const url = req.url();
    if (url.includes('splash') || url.includes('.mp4') || url.includes('.png')) {
      networkEvents.push({ type: 'request', url, time: Date.now() });
      console.log(`[REQ] ${Date.now()} ${url.split('/').pop()}`);
    }
  });

  page.on('response', res => {
    const url = res.url();
    if (url.includes('splash') || url.includes('.mp4') || url.includes('.png')) {
      networkEvents.push({ 
        type: 'response', 
        url, 
        status: res.status(), 
        headers: res.headers(),
        time: Date.now() 
      });
      console.log(`[RES] ${Date.now()} ${url.split('/').pop()} status: ${res.status()} content-length: ${res.headers()['content-length']}`);
    }
  });

  // Block ResDiary safely
  await page.route('**/*resdiary*/**', r => r.fulfill({ status: 200, contentType: 'application/javascript', body: '/* mock */' }));

  const navStart = Date.now();
  console.log(`Navigating to https://gemagroup.id/en at t=0...`);
  await page.goto('https://gemagroup.id/en', { waitUntil: 'domcontentloaded' });

  // Instrument video and poster events
  const metrics = await page.evaluate(async (navStart) => {
    const log = [];
    const push = (event, extra = {}) => {
      log.push({ event, elapsed: Date.now() - navStart, ...extra });
    };

    const img = document.querySelector('img[data-splash-element="poster-fallback"]');
    if (img) {
      push('img_found', { 
        src: img.src, 
        complete: img.complete, 
        naturalWidth: img.naturalWidth, 
        naturalHeight: img.naturalHeight 
      });
      img.addEventListener('load', () => {
        push('img_onload', { naturalWidth: img.naturalWidth, naturalHeight: img.naturalHeight });
      });
    }

    return new Promise((resolve) => {
      let interval;
      let count = 0;
      interval = setInterval(() => {
        count++;
        const video = document.querySelector('video[data-splash-element="video-stream"]');
        const img = document.querySelector('img[data-splash-element="poster-fallback"]');
        
        push(`tick_${count}`, {
          hasVideo: !!video,
          videoSrc: video ? video.currentSrc : null,
          readyState: video ? video.readyState : null,
          networkState: video ? video.networkState : null,
          currentTime: video ? video.currentTime : null,
          paused: video ? video.paused : null,
          videoOpacity: video ? window.getComputedStyle(video).opacity : null,
          imgComplete: img ? img.complete : null,
          imgNaturalWidth: img ? img.naturalWidth : null,
          imgOpacity: img ? window.getComputedStyle(img).opacity : null,
        });

        if (video && !video.__instrumented) {
          video.__instrumented = true;
          ['loadstart', 'loadedmetadata', 'loadeddata', 'canplay', 'canplaythrough', 'play', 'playing', 'error', 'waiting'].forEach(ev => {
            video.addEventListener(ev, () => {
              push(`video_${ev}`, {
                currentTime: video.currentTime,
                readyState: video.readyState,
                networkState: video.networkState,
              });
            });
          });
        }

        if (count >= 15) { // 7.5s
          clearInterval(interval);
          resolve(log);
        }
      }, 500);
    });
  }, navStart);

  console.log('\n--- TIMELINE METRICS ---');
  for (const m of metrics) {
    console.log(`${(m.elapsed / 1000).toFixed(2)}s: [${m.event}]`, JSON.stringify(m));
  }

  await browser.close();
}

diagnose().catch(console.error);
