import { chromium, Page } from 'playwright-core-a';

(async () => {
    const browser = await chromium.launch({
        headless: false,
        executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
    });


    const context = await browser.newContext({
        viewport: null,
    });

    const page: Page = await context.newPage();

    await page.goto('https://www.facebook.com/');

    context.on('onaction', async (data: any) => {
        if (data['action'] === 'inspecting') {
            console.log(data);
        }
    });

    setTimeout(async () => {
        const selectorElement = await page.evaluateHandle(({ x, y }) => {
            const getPos = (element: any) => {
                let position = 1;
                for (let curNode = element.previousSibling; curNode; curNode = curNode.previousSibling) {
                    if (curNode.nodeName == element.nodeName) {
                        ++position;
                    }
                }
                return position;
            }

            const getXpath = (htmlElement: any) => {
                try {
                    let xpath = '';
                    for (let element = htmlElement; element && !(element instanceof Document); element = element.nodeType === Node.ATTRIBUTE_NODE ? element.ownerElement : element.parentNode) {
                        let nodeName;
                        switch (element.nodeType) {
                            case Node.TEXT_NODE:
                                nodeName = 'text()';
                                break;
                            case Node.ATTRIBUTE_NODE:
                                nodeName = '@' + element.nodeName;
                                break;
                            case Node.PROCESSING_INSTRUCTION_NODE:
                                nodeName = 'processing-instruction()';
                                break;
                            case Node.COMMENT_NODE:
                                nodeName = 'comment()';
                                break;
                            case Node.ELEMENT_NODE:
                                nodeName = element.nodeName;
                                break;
                        }
                        const position = getPos(element);
                        xpath = '/' + nodeName.toLowerCase() + (position !== null ? '[' + position + ']' : '') + xpath;
                    }
                    return xpath;
                } catch { }

                return "";
            };

            return getXpath(document.elementFromPoint(x, y));
        }, { x: 755, y: 620 });

        const fullXpath = await selectorElement.evaluate((obj) => obj);

        await page.locator(`xpath=${fullXpath}`).click();

        console.log('clicked');
    }, 5000);


    await page.pause();

})();

// currentHover = document.elementFromPoint(683,608);
// currentHover.click()

// window.innerWidth
// window.innerHeight