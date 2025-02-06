import { test } from '@playwright/test';
import { PageActionsHelper } from '../../../src/helpers/page-actions-helpers';
import { homePage } from '../../../src/selectors/hoome-page';
import { PageValidationsHelper } from '../../../src/helpers/page-validations-helpers';
import { signUp } from '../../../src/selectors/sign-up';
import { env } from '../../../environments/environment';


test('Verify Error message for invalid login attempt - #error #regression', async ({ page }) => {

    const pageActions = new PageActionsHelper(page);
    const pageValidations = new PageValidationsHelper(page);
    
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

test('Verify Error message when resgistering with existing email - #error #regression', async ({ page }) => {

    const pageActions = new PageActionsHelper(page);
    const pageValidations = new PageValidationsHelper(page);

    await pageActions.navigateTo(env.sit.baseUrl);
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
