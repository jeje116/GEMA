const { chromium } = require('/Users/jasonsjanuard/scratch_playwright/node_modules/playwright');

const THROTTLE_PROFILES = [
  {
    name: 'Fast (~50 Mbps)',
    downloadThroughput: (50 * 1024 * 1024) / 8, // 6.25 MB/s
    uploadThroughput: (20 * 1024 * 1024) / 8,
    latency: 20,
  },
  {
    name: 'Good Broadband/4G (~10 Mbps)',
    downloadThroughput: (10 * 1024 * 1024) / 8, // 1.25 MB/s
    uploadThroughput: (5 * 1024 * 1024) / 8,
    latency: 40,
  },
  {
    name: 'Constrained Mobile (~5 Mbps)',
    downloadThroughput: (5 * 1024 * 1024) / 8, // 625 KB/s
    uploadThroughput: (2 * 1024 * 1024) / 8,
    latency: 80,
  },
];

const VARIANTS = [
  { id: 'b', label: 'Variant B (Prod 4K)' },
  { id: 'c1', label: 'Variant C1 (1440p CRF 21)' },
  { id: 'c2', label: 'Variant C2 (1440p CRF 23)' },
];

async function runBenchmark() {
  console.log('=== GEMA SPLASH PERFORMANCE BENCHMARK (LOCALHOST) ===\n');
  const browser = await chromium.launch({ headless: true });

  let totalResDiaryRequests = 0;
  let totalBookings = 0;

  const results = {
    desktop: [],
    mobile: [],
  };

  // Helper for single test run
  async function testRun({ isMobile, variantId, profile }) {
    const context = await browser.newContext({
      viewport: isMobile ? { width: 390, height: 844 } : { width: 1440, height: 900 },
      isMobile: isMobile,
      hasTouch: isMobile,
    });
    const page = await context.newPage();

    // ResDiary Safety Protocol
    await page.route('**/*resdiary*/**', route => {
      totalResDiaryRequests++;
      if (route.request().method() === 'POST') totalBookings++;
      return route.fulfill({ status: 200, contentType: 'application/javascript', body: '/* mock */' });
    });

    // Apply CDP Throttling
    const cdp = await context.newCDPSession(page);
    await cdp.send('Network.enable');
    await cdp.send('Network.emulateNetworkConditions', {
      offline: false,
      latency: profile.latency,
      downloadThroughput: profile.downloadThroughput,
      uploadThroughput: profile.uploadThroughput,
    });

    let bytesDownloadedBeforePlayback = 0;
    let playbackStarted = false;
    const mediaRequests = [];

    page.on('response', resp => {
      const url = resp.url();
      if (url.includes('.mp4')) {
        const headers = resp.headers();
        const cl = parseInt(headers['content-length'] || '0', 10);
        if (!playbackStarted && cl > 0) {
          bytesDownloadedBeforePlayback += cl;
        }
        mediaRequests.push({
          file: url.split('/').pop(),
          status: resp.status(),
          size: cl,
        });
      }
    });

    const targetUrl = `http://localhost:3001/en?splashVariant=${variantId}`;
    const t0 = Date.now();
    await page.goto(targetUrl, { waitUntil: 'domcontentloaded' });

    await page.waitForSelector('video[data-splash-element="video-stream"]');

    const metrics = await page.evaluate((t0) => {
      const video = document.querySelector('video[data-splash-element="video-stream"]');
      let stalledCount = 0;
      let waitingCount = 0;
      let onPlayingTime = null;

      video.addEventListener('stalled', () => stalledCount++);
      video.addEventListener('waiting', () => waitingCount++);
      video.addEventListener('playing', () => {
        if (!onPlayingTime) onPlayingTime = Date.now() - t0;
      });

      return new Promise(resolve => {
        const check = () => {
          if (!video.paused && video.currentTime > 0) {
            resolve({
              timeToFirstFrameMs: Date.now() - t0,
              timeToPlayingMs: onPlayingTime || (Date.now() - t0),
              videoSrc: video.currentSrc,
              videoWidth: video.videoWidth,
              videoHeight: video.videoHeight,
              readyState: video.readyState,
              currentTime: video.currentTime,
              stalledCount,
              waitingCount,
            });
            return true;
          }
          return false;
        };

        if (check()) return;

        video.addEventListener('playing', () => {
          setTimeout(check, 100);
        });

        // Safety timeout
        setTimeout(() => {
          resolve({
            timeToFirstFrameMs: -1,
            timeToPlayingMs: -1,
            videoSrc: video.currentSrc,
            videoWidth: video.videoWidth,
            videoHeight: video.videoHeight,
            readyState: video.readyState,
            currentTime: video.currentTime,
            stalledCount,
            waitingCount,
            timeout: true,
          });
        }, 15000);
      });
    }, t0);

    playbackStarted = true;

    // Monitor for 4 seconds of playback to check for stalls/buffering
    await page.waitForTimeout(4000);
    const postPlayMetrics = await page.evaluate(() => {
      const video = document.querySelector('video[data-splash-element="video-stream"]');
      return {
        currentTime: video.currentTime,
        paused: video.paused,
      };
    });

    const wrongDevice = isMobile
      ? mediaRequests.some(r => r.file.includes('desktop'))
      : mediaRequests.some(r => r.file.includes('mobile'));

    await context.close();

    return {
      variant: variantId,
      profile: profile.name,
      firstFrameMs: metrics.timeToFirstFrameMs,
      playingMs: metrics.timeToPlayingMs,
      bytesBeforePlay: bytesDownloadedBeforePlayback,
      readyState: metrics.readyState,
      videoWidth: metrics.videoWidth,
      videoHeight: metrics.videoHeight,
      stalls: metrics.stalledCount,
      waiting: metrics.waitingCount,
      playbackAdvanced: postPlayMetrics.currentTime > 3.0,
      mediaRequestsCount: mediaRequests.length,
      wrongDevice,
    };
  }

  // RUN DESKTOP BENCHMARKS
  console.log('--- RUNNING DESKTOP BENCHMARKS ---');
  for (const variant of VARIANTS) {
    for (const profile of THROTTLE_PROFILES) {
      process.stdout.write(`Testing Desktop [${variant.label}] at ${profile.name}... `);
      const res = await testRun({ isMobile: false, variantId: variant.id, profile });
      results.desktop.push(res);
      console.log(`First frame: ${(res.firstFrameMs / 1000).toFixed(2)}s | Downloaded: ${(res.bytesBeforePlay / (1024 * 1024)).toFixed(2)} MB`);
    }
  }

  // RUN MOBILE BENCHMARKS
  console.log('\n--- RUNNING MOBILE BENCHMARKS ---');
  for (const variant of VARIANTS) {
    for (const profile of THROTTLE_PROFILES) {
      process.stdout.write(`Testing Mobile [${variant.label}] at ${profile.name}... `);
      const res = await testRun({ isMobile: true, variantId: variant.id, profile });
      results.mobile.push(res);
      console.log(`First frame: ${(res.firstFrameMs / 1000).toFixed(2)}s | Downloaded: ${(res.bytesBeforePlay / (1024 * 1024)).toFixed(2)} MB`);
    }
  }

  await browser.close();

  console.log('\n--- RESDIARY PROTOCOL SAFETY CHECK ---');
  console.log(`Live ResDiary Requests: 0 (all mocked, total intercepted: ${totalResDiaryRequests})`);
  console.log(`Live Bookings Submitted: ${totalBookings}`);

  console.log('\n=== BENCHMARK COMPLETE ===');
  console.log(JSON.stringify(results, null, 2));
}

runBenchmark().catch(console.error);
