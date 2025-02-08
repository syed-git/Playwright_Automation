import { Browser, Page, chromium, firefox, webkit } from 'playwright';
import { env } from '../../environments/environment';
import { Context } from 'vm';

export async function launchBrowser(): Promise<Page | undefined> {
    // Launching the browser in headless mode
    const browserType: string = env.sit.browserType;
    let page: Page;
    let browser: Browser;
    let context: Context;

    if (browserType === 'chromium') {

        browser = await chromium.launch({ headless: false });
        context = await browser.newContext();
        page = await context.newPage();
        return page;
    } else if (browserType === 'firefox') {
        browser = await firefox.launch({ headless: false});
        context = await browser.newContext();
        page = await context.newPage();
        return page;
    } else if (browserType === 'webkit') {
        browser = await webkit.launch();
        context = await browser.newContext();
        page = await context.newPage();
        return page;
    }
  }