import { chromium, Page } from 'playwright-core';

(async () => {
    const browser = await chromium.launch({
        headless: false,
        executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
    });
    
    const page:Page = await browser.newPage();

    page.context().on('onaction', (data:Object) => {
        console.log('Action', data);
    });

    await page.goto('https://www.google.com/');
    await page.pause();
})();