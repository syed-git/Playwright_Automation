import { Browser, Page, chromium, selectors } from 'playwright';
import moment, { Moment } from 'moment';
import { PageValidationsHelper } from './page-validations-helpers';

export class PageActionsHelper extends PageValidationsHelper {

    private page: Page 
    
    constructor(page: any) {
        super(page);
        this.page = page;
    }

    async navigateTo(url: string) {
        await this.page.goto(url);
        await this.waitForPageLoad();
    }


    async waitForPageLoad(time: number = 120) {
        let state: string = '';
        state = await this.page.evaluate(() => {
            return document.readyState;
          });
          let end: number = time;
          let index: number = 0;
          while (!state && index < end) {
            state = await this.page.evaluate(() => {
                // This code runs inside the browser context
                return document.readyState; // Example: retrieve the page's title
              });
              index++;
          }
    }

    async clickOn(selector: string) {
        if (await this.page.$(selector)) {
            await this.page.locator(selector).click();
            await this.waitForPageLoad();
        } else {
            throw new Error('could not find the element, so unable to click the element')
        }
    }

    async jsClick(selector: string) {
        await this.page.evaluate(() => {
            const button = document.querySelector(selector);
            if (button) {
              ;  // This simulates clicking the button using JS
            }
          });
    }

    async fillField(selector: string, value: string) {
        await this.page.locator(selector).fill(value);
        this.waitForPageLoad();

    }

    async fillFieldWithFutureDate(selector: string, days: number, format: string = 'YYYY-MM-DD') {
        const date: string = moment().add(days, 'days').format(format);
        await this.fillField(selector, date);
        await this.waitForPageLoad();
    }

    async selectOption(selector: string, value: any) {
        await this.page.locator(selector).selectOption(value);
        await this.waitForPageLoad();
    }

    async decrypt_password(encodedPassword: string) {
        const decodedPassword: string = Buffer.from(encodedPassword, 'base64').toString('utf-8');
        return decodedPassword;
    }

    async enterPassword(selector: string, encodedPassword: string) {
        const password: string = await this.decrypt_password(encodedPassword);
        await this.fillField(selector, password);
    }
}