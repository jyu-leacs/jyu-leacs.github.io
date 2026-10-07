// Rasterize the site's own HTML layout into a 1200×630 sharing image.
import { chromium } from '@playwright/test';
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('http://localhost:8080/', { waitUntil: 'networkidle' });
  await page.addStyleTag({ content: '.site-header,.hero-actions,.hero-topics,.next-session,.section,.explore-band,.invite,.site-footer{display:none!important}.hero{height:630px;padding-block:56px;display:grid;align-items:center}.hero h1{font-size:64px}.hero-lead{font-size:18px}.hero-inner{grid-template-columns:1.1fr 1fr;gap:48px}.container{width:calc(100% - 112px)}' });
  await page.evaluate(() => { document.querySelector('.hero-eyebrow').lastChild.textContent = 'LEACS seminars · University of Jyväskylä'; });
  await page.screenshot({ path: 'src/assets/social-blue.png' });
} finally { await browser.close(); }
