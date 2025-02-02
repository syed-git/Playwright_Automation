import { test, expect } from '@playwright/test';
import { PageActionsHelper } from '../../../src/helpers/page-actions-helpers';
import { homePage } from '../../../src/selectors/hoome-page';
import { PageValidationsHelper } from '../../../src/helpers/page-validations-helpers';
import { signUp } from '../../../src/selectors/sign-up';
import { sign } from 'crypto';

test('Register a user smoke', async ({ page }) => {

    const pageActions = new PageActionsHelper(page);
    const pageValidations = new PageValidationsHelper(page);

    console.log(process.argv);
    await pageActions.navigateTo('https://automationexercise.com/');
    await pageValidations.seeTitleContains(homePage.pageTitle);
    await pageValidations.seeElementExists(homePage.home);
    await pageActions.clickOn(homePage.signUpButton);
    await pageValidations.seeTitleContains(signUp.pageTitle, true);
    await pageValidations.seeElementPresent(signUp.newUserSignUp, 'visible');
    await pageValidations.seeElementExists(signUp.loginToYourAccount);
    await pageActions.fillField(signUp.name, 'Syed Zubair');
    await pageActions.fillField(signUp.signUpEmail, 'sdzubair.engg@gmail.com');
});
