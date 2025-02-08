/*
    This test is added just to show how we can launch the desired browser based on config settings
    And to show how the beforeEach hook works
    To test this, we need to comment out all the browsers in playwright.config.ts
*/

import { test } from '@playwright/test';
import { PageActionsHelper } from '../../../src/helpers/page-actions-helpers';
import { homePage } from '../../../src/selectors/hoome-page';
import { launchBrowser } from '../../../src/helpers/launch-page';
import { PageValidationsHelper } from '../../../src/helpers/page-validations-helpers';
import { signUp } from '../../../src/selectors/sign-up';
import { env } from '../../../environments/environment';

let pageActions: any;
let pageValidations: any;
let page: any;

test.beforeEach(async () => {
    page = await launchBrowser();
    pageActions = new PageActionsHelper(page);
    pageValidations = new PageValidationsHelper(page);
    await pageActions.navigateTo(env.sit.baseUrl);
  });


test('Verify Error message for invalid login attempt - #example #regression', async () => {
    await pageValidations.seeTitleContains(homePage.pageTitle, true);
    await pageValidations.seeElementExists(homePage.home);
    await pageActions.clickOn(homePage.signUpButton);
    await pageValidations.seeTitleContains(signUp.pageTitle, true);
    await pageValidations.seeElementExists(signUp.loginToYourAccount);
    await pageActions.fillField(signUp.loginEmail, 'syedzubaiir312@gmail.com');
    await pageActions.enterPassword(signUp.loginPassword, '67Fghy#-==');
    await pageActions.clickOn(signUp.loginButton);
    await pageValidations.seeElementContains(signUp.errorMessage, 'Your email or password is incorrect!', true);
});

test('Verify Error message when resgistering with existing email - #example #regression', async () => {
   
    await pageValidations.seeTitleContains(homePage.pageTitle);
    await pageValidations.seeElementExists(homePage.home);
    await pageActions.clickOn(homePage.signUpButton);
    await pageValidations.seeTitleContains(signUp.pageTitle, true);
    await pageValidations.seeElementPresent(signUp.newUserSignUp, 'visible');
    await pageValidations.seeElementExists(signUp.loginToYourAccount);
    await pageActions.fillField(signUp.name, env.sit.register.name);
    await pageActions.fillField(signUp.signUpEmail, `syed.zubair4929@gmail.com`);
    await pageActions.clickOn(signUp.signUpButton);
    await pageValidations.seeElementContains(signUp.existingEmailError, 'Email Address already exist!', true);
});
