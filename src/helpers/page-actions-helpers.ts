import { Page } from 'playwright';
import { PageValidationsHelper } from './page-validations-helpers';
import path from 'path';
import moment from 'moment';

export class PageActionsHelper extends PageValidationsHelper {

    private page: Page 
    
    constructor(page: Page) {
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
          const end: number = time;
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
            const button: any = document.querySelector(selector);  // Replace with your selector
            if (button) {
              button.click();  // Simulate a click using JavaScript
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

    async uploadFile (selector: string, fileName: string) {
        try {
            const currentDir: string = __dirname;
            const projectRoot: string = path.resolve(currentDir, '..', '..');
            const fileLocation: string = path.join(projectRoot, 'test-data', fileName);

            const fileInput: any = await this.page.locator(selector);
            await fileInput.setInputFiles(fileLocation);
            await this.waitForPageLoad()
            await this.getScreenshot();
        } catch (err: any) {
            await this.getScreenshot();
            throw new Error(err.toString());
        }
        
    }

    async acceptAlert() {
        await this.page.on('dialog', async (dialog) => {
            // Accept the alert
            await dialog.accept();
          });
    }

    async pressKeys(key: string) {
        await this.page.keyboard.press(key);
        await this.waitForPageLoad();
    }
}