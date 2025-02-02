import { test, expect } from '@playwright/test';
import { PageActionsHelper } from '../../../src/helpers/page-actions-helpers';
import { homePage } from '../../../src/selectors/hoome-page';
import { PageValidationsHelper } from '../../../src/helpers/page-validations-helpers';
import { signUp } from '../../../src/selectors/sign-up';
import { env } from '../../../environments/environment';
import { LoginHelper } from '../../../src/helpers/login-helper';


test('Login to Application with valid credentials - #smoke', async ({ page }) => {

    const pageActions = new PageActionsHelper(page);
    const pageValidations = new PageValidationsHelper(page);

    await pageActions.navigateTo(env.sit.baseUrl);
    await pageValidations.seeTitleContains(homePage.pageTitle);
    await pageValidations.seeElementExists(homePage.home);
    await pageActions.clickOn(homePage.signUpButton);
    await pageValidations.seeTitleContains(signUp.pageTitle, true);
    await pageValidations.seeElementPresent(signUp.newUserSignUp, 'visible');
    await pageValidations.seeElementExists(signUp.loginToYourAccount);
    await pageActions.fillField(signUp.loginEmail, 'syedzubair44@gmail.com');
    await pageActions.enterPassword(signUp.loginPassword, env.sit.password);
    await pageActions.clickOn(signUp.loginButton);
    await pageValidations.seeElementContains(homePage.loggedInAs, 'Syed Zubair');
    await pageActions.clickOn(homePage.logout);
    await pageValidations.seeElementDoesNotExists(homePage.loggedInAs);
});
