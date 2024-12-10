import { chromium, Page } from 'playwright-core';

declare global {
    interface Window {
        onHoverElement(x: any, y: any): void;
    }
}

(async () => {
    const browser = await chromium.launch({
        headless: false,
        executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
    });

    const page: Page = await browser.newPage();

    await page.goto('https://www.facebook.com/');

    // await page.screenshot({ path: 'facebook_screenshot.png', fullPage: true })

    await page.exposeFunction('onHoverElement', (x: any, y: any) => {
        console.log("********** DOOOM **********");
        console.log(x);
        console.log(y);
    });

    await page.evaluate(() => {
        document.addEventListener("mousemove", function (e) {
            if (e.ctrlKey === true) {
                window.onHoverElement(e.clientX, e.clientY);
            }
        });
    });

})();

// currentHover = document.elementFromPoint(683,608);
// currentHover.click()