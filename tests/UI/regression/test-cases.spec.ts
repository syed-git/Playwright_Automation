import { test, expect } from '@playwright/test';
import { PageActionsHelper } from '../../../src/helpers/page-actions-helpers';
import { homePage } from '../../../src/selectors/hoome-page';
import { PageValidationsHelper } from '../../../src/helpers/page-validations-helpers';
import { testCases } from '../../../src/selectors/test-cases';
import { env } from '../../../environments/environment';
import { contactUs } from '../../../src/selectors/contact-us';



test('Verify test cases page is displayed - #testcases', async ({ page }) => {

    const pageActions = new PageActionsHelper(page);
    const pageValidations = new PageValidationsHelper(page);
    
    await pageActions.navigateTo(env.sit.baseUrl);
    await pageValidations.seeTitleContains(homePage.pageTitle, true);
    await pageValidations.seeElementExists(homePage.home);
    await pageActions.clickOn(homePage.testCaseLink);
    await pageValidations.seeTitleContains(testCases.pageTitle, true);
    await page.pause();
    await pageValidations.seeElementContains(testCases.testCases, 'Test Cases', true);
});
