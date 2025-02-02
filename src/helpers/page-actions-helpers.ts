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
            await this.getScreenshot();
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

    async getScreenshot() {
        const filePath: string = 'D:/szubair/Projects/Automation/Plywright_Automation_Testing/Playwright_Automation/test-results/screenshots'
        const title: string = (await this.page.title()).replace(/[^a-zA-Z0-9]/g, '');

        const dateAndTime = moment().format('YYYY-MM-DDHH-mm-ss-SSS');

        await this.page.screenshot({
            path: `${filePath}/${title}_${dateAndTime}.png`,  // file path
            fullPage: true,           // capture the full page
            clip: {                   // capture a specific region (x, y, width, height)
              x: 0,
              y: 0,
              width: 800,
              height: 600
            },
            type: 'jpeg',             // specify the format (png or jpeg)
            quality: 80               // set quality for JPEG (0-100)
          });
    }

    async getRandomNumber(length: number) {
        if (length < 1) {
            throw new Error('Length must be at least 1');
          }
          
          // Generate a random number with the given length (number of digits)
          const min = Math.pow(10, length - 1); // Minimum value for the given length
          const max = Math.pow(10, length) - 1; // Maximum value for the given length
          
          // Generate the random number within the range
          return Math.floor(Math.random() * (max - min + 1)) + min;
        
    }
}