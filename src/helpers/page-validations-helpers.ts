import { Browser, Page, chromium, selectors } from 'playwright';
import moment, { Moment } from 'moment';

export class PageValidationsHelper {

    private page: Page 
    
    constructor(page: any) {
        this.page = page;
    }

    async waitForElement(selector: string, condition: string, maxTime: number = 120) {
        const element = this.page.locator(selector); // Adjust the selector as needed
        let flag: boolean = false;
        let end: number = maxTime;
        let index: number = 0;

        if (index === 0) {

            while (!flag && index < end) {
                if (condition === 'clickable') {
                    flag = await element.isEnabled();
                } else if (condition === 'visible') {
                    flag = await element.isVisible();
                } else if (condition === 'displayed') {
                    flag = await element.isDisabled();
                }
                index++;
            }

            if (!flag && index === end) {
                throw new Error(`element is not ${condition} after waiting for the maximum time out`)
            }
        }
    }


    async validateElementExists(selector: string) {
        const element = await this.page.$(selector);

        if(element) {
            return true;
        }
        return false;
    }

    async seeElementExists(selector: string) {

        const elementExist = this.validateElementExists(selector);

        if (!elementExist) {
            throw new Error(`element does not exist`)
        }
    }

    async seeTitleContains(expectedTitle: string, exactMatch: boolean  = false) {

        const actualTitle: string = await this.page.title();
        if (exactMatch) {
            if (expectedTitle !== actualTitle) {
                throw new Error(`Failed: Expecetd title: ${expectedTitle} || Actual title: ${actualTitle}`)
            }
        } else {
            if (!actualTitle.includes(expectedTitle)) {
                throw new Error(`Failed: Expecetd title: ${expectedTitle} || Actual title: ${actualTitle}`)
            }
        }
    }

    async seeElementPresent(selector: string, condition: string ) {
        await this.waitForElement(selector, condition);
    }
}