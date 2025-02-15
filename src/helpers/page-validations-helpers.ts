import moment from 'moment';
import { Page } from 'playwright';
import { promises as fs } from 'fs';

export class PageValidationsHelper {

    private page1: Page 
    
    constructor(page1: any) {
        this.page1 = page1;
    }

    async waitForElement(selector: string, condition: string, maxTime: number = 120) {
        const element = this.page1.locator(selector); // Adjust the selector as needed
        let flag: boolean = false;
        const end: number = maxTime;
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
                await this.getScreenshot();
                throw new Error(`element is not ${condition} after waiting for the maximum time out`)
            }
        }
    }


    async validateElementExists(selector: string) {
        try {
            const element = await this.page1.$(selector);

            if(element) {
                return true;
            }
        } catch (err: any) {
            throw new Error(err.toString());
        }
        return false;
    }

    async seeElementExists(selector: string) {

        const elementExist = this.validateElementExists(selector);

        if (!elementExist) {
            await this.getScreenshot();
            throw new Error(`element does not exist`)
        }
    }

    async seeTitleContains(expectedTitle: string, exactMatch: boolean  = false) {

        const actualTitle: string = await this.page1.title();
        if (exactMatch) {
            if (expectedTitle !== actualTitle) {
                await this.getScreenshot();
                throw new Error(`Failed: Expecetd title: ${expectedTitle} || Actual title: ${actualTitle}`)
            }
        } else {
            if (!actualTitle.includes(expectedTitle)) {
                await this.getScreenshot();
                throw new Error(`Failed: Expecetd title: ${expectedTitle} || Actual title: ${actualTitle}`)
            }
        }
    }

    async seeElementPresent(selector: string, condition: string ) {
        await this.waitForElement(selector, condition);
    }

    async seeElementContains(selector: string, expectedText: string, exactMatch: boolean = false, ) {
        const actualText: any = await this.page1.locator(selector).textContent();
        if (exactMatch) {
            if (expectedText !== actualText) {
                await this.getScreenshot();
                throw new Error(`Failed: Expected: ${expectedText} || Actual: ${actualText}`);
            }
        } else {
            if (!actualText.includes(expectedText)) {
                await this.getScreenshot();
                throw new Error(`Failed: Expected: ${expectedText} || Actual: ${actualText}`);
            }
        }
    }

    async seeElementDoesNotExists(selector: string) {
        const exist: boolean = await this.validateElementExists(selector);

        if (exist) {
            await this.getScreenshot();
            throw new Error(`Failed: Expected element to not exist but element exist on the page`)
        }
    }

    async getScreenshot() {
        const filePath: string = 'D:/szubair/Projects/Automation/Plywright_Automation_Testing/Playwright_Automation/test-results/screenshots'
        const title: string = (await this.page1.title()).replace(/[^a-zA-Z0-9]/g, '');

        const dateAndTime = moment().format('YYYY-MM-DDHH-mm-ss-SSS');
        await this.createDirectoryIfNotExists(filePath);
        await this.page1.screenshot({
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

    async createDirectoryIfNotExists(dirPath: string) {
        try {
          // Check if the directory exists
          await fs.mkdir(dirPath, { recursive: false });
        } catch (error: any) {
            throw new Error(error.toString()); 
        }
    }

    async seeElementState(selector: string, expCondition: any, exactMatch: boolean = false) {

        const element: any = await this.page1.$(selector);
        
        // Check if the element exists
        if (!element) {
            throw new Error(`Element does not exist on the page.`)
        }
   
        const elementType = await element.evaluate((el: { type: any; }) => el.type);
        // Get the element type
        
        // Switch statement to handle different element types
        switch (elementType) {

            case 'checkbox': {
                // If it's a checkbox, check if it's checked
                const isChecked = await element.isChecked();
                if (isChecked !== expCondition) {
                    throw new Error(`Checkbox expected to be ${expCondition} but found to be ${isChecked}`);
                }
                break;
            }

            case 'radio': {
                // If it's a radio button, check if it's selected
                const isRadioSelected = await element.isChecked();
                if (isRadioSelected !== expCondition) {
                    throw new Error(`Radio button expected to be ${expCondition} but found to be ${isRadioSelected}`);
                }
                break;
            }

            case 'text':
            case 'password':
            case 'textarea': {
                // get value from input field
                const actualValue = await this.page1.locator(selector).inputValue();
                if (exactMatch) {
                    if (expCondition !== actualValue) {
                        throw new Error(`Expected text: ${expCondition} but actual text: ${actualValue}`);
                    }
                } else {
                    if (!actualValue.includes(expCondition)) {
                        throw new Error(`Actual text: ${actualValue} does not have expected text: ${expCondition}`);
                    }
                }
                break;
            }

            default: {
                // For non-form elements, fetch the text content
                const textContent = await element.textContent();
                if (exactMatch) {
                    
                    if (textContent !== expCondition) {
                        throw new Error(`Actual text: ${textContent} does not have expected text: ${expCondition}`);
                    }
                } else {
                    if (!textContent?.includes(expCondition)) {
                        throw new Error(`Actual text: ${textContent} does not have expected text: ${expCondition}`)
                    }
                }
            break;
            }
        }
      }
}
    