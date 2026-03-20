import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const puppeteer = require('C:/Users/Chris/AppData/Roaming/npm/node_modules/puppeteer/lib/cjs/puppeteer/puppeteer.js');

const chromeVersionDir = require('fs').readdirSync('C:/Users/Chris/.cache/puppeteer/chrome/')[0];
const chromePath = `C:/Users/Chris/.cache/puppeteer/chrome/${chromeVersionDir}/chrome-win64/chrome.exe`;

async function screenshot() {
    let browser;
    try {
        browser = await puppeteer.launch({ executablePath: chromePath, headless: 'new' });
        const page = await browser.newPage();

        // Desktop screenshot (1440px)
        await page.setViewport({ width: 1440, height: 900 });
        await page.goto('http://localhost:3001', { waitUntil: 'networkidle2' });

        // Wait for animations to load and complete
        await page.evaluate(() => {
            if (window.gsap) {
                gsap.globalTimeline.progress(1, true);
                gsap.globalTimeline.pause();
            }
            window.scrollTo(0, 0);
        });
        await new Promise(r => setTimeout(r, 600));

        await page.screenshot({ path: './temporary screenshots/screenshot-desktop.png', fullPage: true });
        console.log('✅ Desktop screenshot saved');

        // Mobile screenshot (375px)
        await page.setViewport({ width: 375, height: 812 });
        await page.goto('http://localhost:3001', { waitUntil: 'networkidle2' });

        await page.evaluate(() => {
            if (window.gsap) {
                gsap.globalTimeline.progress(1, true);
                gsap.globalTimeline.pause();
            }
            window.scrollTo(0, 0);
        });
        await new Promise(r => setTimeout(r, 600));

        await page.screenshot({ path: './temporary screenshots/screenshot-mobile.png', fullPage: true });
        console.log('✅ Mobile screenshot saved');

        await browser.close();
    } catch (error) {
        console.error('❌ Screenshot error:', error);
        process.exit(1);
    }
}

screenshot();
