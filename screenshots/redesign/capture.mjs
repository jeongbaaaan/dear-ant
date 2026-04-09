import { chromium } from 'playwright';

const pages = [
  { name: '01-home', path: '/', waitFor: 2000 },
  { name: '02-survey', path: '/survey', waitFor: 1500 },
  { name: '03-report-list', path: '/report', waitFor: 1500 },
  { name: '04-journal', path: '/memo', waitFor: 1500 },
  { name: '05-calculator', path: '/calculator', waitFor: 1500 },
  { name: '06-compound', path: '/compound', waitFor: 1500 },
  { name: '07-simulator', path: '/tools/simulator', waitFor: 1500 },
];

const BASE = 'http://localhost:3000';
const OUT = './screenshots/redesign';

async function capture() {
  const browser = await chromium.launch();

  // Desktop (1440x900)
  const desktopCtx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });

  for (const p of pages) {
    const page = await desktopCtx.newPage();
    await page.goto(`${BASE}${p.path}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(p.waitFor);

    // Full page screenshot
    await page.screenshot({
      path: `${OUT}/${p.name}-desktop.png`,
      fullPage: true,
    });

    // Viewport-only screenshot (above the fold)
    await page.screenshot({
      path: `${OUT}/${p.name}-desktop-fold.png`,
      fullPage: false,
    });

    await page.close();
    console.log(`✓ ${p.name} desktop`);
  }

  await desktopCtx.close();

  // Mobile (390x844, iPhone 14)
  const mobileCtx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
  });

  for (const p of pages) {
    const page = await mobileCtx.newPage();
    await page.goto(`${BASE}${p.path}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(p.waitFor);

    await page.screenshot({
      path: `${OUT}/${p.name}-mobile.png`,
      fullPage: true,
    });

    await page.close();
    console.log(`✓ ${p.name} mobile`);
  }

  await mobileCtx.close();

  // Report detail (needs a report ID — create one if possible)
  const detailCtx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });

  // Try to get a report ID from the report list page
  const listPage = await detailCtx.newPage();
  await listPage.goto(`${BASE}/report`, { waitUntil: 'networkidle' });
  await listPage.waitForTimeout(1000);

  // Check if there are any report links
  const reportLink = await listPage.$('a[href^="/result/"]');
  if (reportLink) {
    const href = await reportLink.getAttribute('href');
    await listPage.goto(`${BASE}${href}`, { waitUntil: 'networkidle' });
    await listPage.waitForTimeout(1500);
    await listPage.screenshot({
      path: `${OUT}/04-report-detail-desktop.png`,
      fullPage: true,
    });
    console.log(`✓ report-detail desktop`);
  } else {
    console.log(`⚠ No reports found — skipping report detail screenshot`);
  }

  await detailCtx.close();
  await browser.close();
  console.log(`\nDone! Screenshots saved to ${OUT}/`);
}

capture().catch(console.error);
