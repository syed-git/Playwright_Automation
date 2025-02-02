import { test, expect } from '@playwright/test';
import { PageActionsHelper } from '../../../src/helpers/page-actions-helpers';
import { homePage } from '../../../src/selectors/hoome-page';
import { PageValidationsHelper } from '../../../src/helpers/page-validations-helpers';
import { signUp } from '../../../src/selectors/sign-up';
import { env } from '../../../environments/environment';
import { LoginHelper } from '../../../src/helpers/login-helper';


test('Verify Error message for invalid login attempt - #error #regression', async ({ page }) => {

    const pageActions = new PageActionsHelper(page);
    const pageValidations = new PageValidationsHelper(page);
    const loginHelper = new LoginHelper(page);

    await pageActions.navigateTo(env.sit.baseUrl);
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
