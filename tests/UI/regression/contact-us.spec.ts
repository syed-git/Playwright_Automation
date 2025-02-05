import { test, expect } from '@playwright/test';
import { PageActionsHelper } from '../../../src/helpers/page-actions-helpers';
import { homePage } from '../../../src/selectors/hoome-page';
import { PageValidationsHelper } from '../../../src/helpers/page-validations-helpers';
import { signUp } from '../../../src/selectors/sign-up';
import { env } from '../../../environments/environment';
import { contactUs } from '../../../src/selectors/contact-us';
import { LoginHelper } from '../../../src/helpers/login-helper';


test('Contact us form validations - #contact', async ({ page }) => {

    const pageActions = new PageActionsHelper(page);
    const pageValidations = new PageValidationsHelper(page);
    
    await pageActions.navigateTo(env.sit.baseUrl);
    await pageValidations.seeTitleContains(homePage.pageTitle, true);
    await pageValidations.seeElementExists(homePage.home);
    await pageActions.clickOn(homePage.contactUs);
    await pageValidations.seeTitleContains(contactUs.pageTitle, true);
    await pageValidations.seeElementContains(contactUs.getInTouch, 'Get In Touch', true);
    await pageActions.fillField(contactUs.name, 'Syed Zubair');
    await pageActions.fillField(contactUs.email, 'syedzubair4929@gmail.com');
    await pageActions.fillField(contactUs.subject, 'Query rekated to to refund');
    await pageActions.fillField(contactUs.message, 'I did not receive the refund for my returned order');
    await pageActions.uploadFile(contactUs.fileInput, 'sampleFile.jpg');
    // await page.evaluate(() => {
    //     window.scrollTo(0, document.body.scrollHeight);
    //   });
      const element = page.locator('button[type="submit"]');  // Replace with your element's selector
  
      // Scroll the element into view if it's not already visible
      await element.scrollIntoViewIfNeeded();
      await pageValidations.getScreenshot();

    await page.click('button[type="submit"]', {force: true});
    
    await pageValidations.seeElementContains(contactUs.successMessage, 'Success! Your details have been submitted successfully.', true);
    await page.pause();
    
});
