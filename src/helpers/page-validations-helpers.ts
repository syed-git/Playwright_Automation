import { Browser, Page, chromium, selectors } from 'playwright';
import moment, { Moment } from 'moment';
import { CommonHelper } from './CommonHelper';

export class PageValidationsHelper {

    private page1: Page 
    
    constructor(page1: any) {
        this.page1 = page1;
    }

    async waitForElement(selector: string, condition: string, maxTime: number = 120) {
        const element = this.page1.locator(selector); // Adjust the selector as needed
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
        const element = await this.page1.$(selector);

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

        const actualTitle: string = await this.page1.title();
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

    async seeElementContains(selector: string, expectedText: string, exactMatch: boolean = false, ) {
        let actualText: any = await this.page1.locator(selector).textContent();
        if (exactMatch) {
            if (expectedText !== actualText) {
                throw new Error(`Failed: Expected: ${expectedText} || Actual: ${actualText}`);
            }
        } else {
            if (!actualText.includes(expectedText)) {
                throw new Error(`Failed: Expected: ${expectedText} || Actual: ${actualText}`);
            }
        }
    }

    async seeElementDoesNotExists(selector: string) {
        const exist: boolean = await this.validateElementExists(selector);

        if (exist) {
            throw new Error(`Failed: Expected element to not exist but element exist on the page`)
        }
    }
}