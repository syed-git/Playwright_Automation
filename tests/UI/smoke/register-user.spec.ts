import { test, expect } from '@playwright/test';
import { PageActionsHelper } from '../../../src/helpers/page-actions-helpers';
import { homePage } from '../../../src/selectors/hoome-page';
import { PageValidationsHelper } from '../../../src/helpers/page-validations-helpers';
import { signUp } from '../../../src/selectors/sign-up';
import { env } from '../../../environments/environment';

test('Register a user #smoke', async ({ page }) => {

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
    await pageActions.fillField(signUp.signUpEmail, `user.test${await pageActions.getRandomNumber(5)}@gmail.com`);
    await pageActions.clickOn(signUp.signUpButton);
    await pageValidations.seeElementContains(signUp.enterAccountInfo, 'Enter Account Information', true);
    await pageActions.clickOn(signUp.title.mr);
    await pageActions.enterPassword(signUp.password, env.sit.register.password);
    await pageActions.selectOption(signUp.dobDay, {value: env.sit.register.date});
    await pageActions.selectOption(signUp.dobMonth, {index: env.sit.register.month});
    await pageActions.selectOption(signUp.dobYear, {value: env.sit.register.year});
    await pageActions.clickOn(signUp.newsLetterCheckbox);
    await pageActions.clickOn(signUp.receiveSpecialOffer);
    await pageActions.fillField(signUp.fisrtName, env.sit.register.fisrtName);
    await pageActions.fillField(signUp.lastName, env.sit.register.lastName);
    await pageActions.fillField(signUp.company, env.sit.register.company);
    await pageActions.fillField(signUp.address1, env.sit.register.address1);
    await pageActions.fillField(signUp.address2, env.sit.register.address2);
    await pageActions.selectOption(signUp.country, {value: 'India'});
    await pageActions.fillField(signUp.state, env.sit.register.state);
    await pageActions.fillField(signUp.city, env.sit.register.city);
    await pageActions.fillField(signUp.zipCode, env.sit.register.zipCode);
    await pageActions.fillField(signUp.mobileNumber, env.sit.register.mobile);
    await pageActions.clickOn(signUp.createAccount);
    await pageValidations.seeElementContains(signUp.accountCreated, 'Account Created!', true);
    await pageActions.clickOn(signUp.continueButton);
    await pageValidations.seeElementContains(homePage.loggedInAs, env.sit.register.fisrtName);
    await pageValidations.seeElementExists(homePage.deleteAccount);
    await pageActions.clickOn(homePage.deleteAccount);
    await pageValidations.seeElementContains(homePage.accountDeleted, 'Account Deleted!', true);
    await pageActions.clickOn(homePage.continueButton);
});
