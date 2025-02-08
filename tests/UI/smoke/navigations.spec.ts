/* This test is added to check all the screens are working fine or not*/
import { test } from '@playwright/test';
import { PageActionsHelper } from '../../../src/helpers/page-actions-helpers';
import { homePage } from '../../../src/selectors/hoome-page';
import { PageValidationsHelper } from '../../../src/helpers/page-validations-helpers';
import { signUp } from '../../../src/selectors/sign-up';
import { env } from '../../../environments/environment';
import { products } from '../../../src/selectors/products';
import { cart } from '../../../src/selectors/cart';
import { testCases } from '../../../src/selectors/test-cases';
import { apiTesting } from '../../../src/selectors/api-testing';
import { video } from '../../../src/selectors/video-tutorial';
import { contactUs } from '../../../src/selectors/contact-us';

test('Validate all the screens - #smoke', async ({ page }) => {

    const pageActions = new PageActionsHelper(page);
    const pageValidations = new PageValidationsHelper(page);

    await pageActions.navigateTo(env.sit.baseUrl);
    await pageValidations.seeTitleContains(homePage.pageTitle);
    await pageValidations.seeElementExists(homePage.home);
    await pageActions.clickOn(homePage.productsLink);
    await pageValidations.seeTitleContains(products.pageTitle, true);
    await pageValidations.seeElementContains(products.allProducts, 'All Products', true)
    await pageActions.clickOn(homePage.cart);
    await pageValidations.seeTitleContains(cart.pageTitle)
    await pageValidations.seeElementContains(cart.shoppingCart, 'Shopping Cart', true);
    await pageActions.clickOn(homePage.signUpButton);
    await pageValidations.seeTitleContains(signUp.pageTitle, true);
    await pageValidations.seeElementPresent(signUp.newUserSignUp, 'visible');
    await pageActions.clickOn(homePage.testCaseLink);
    await pageValidations.seeTitleContains(testCases.pageTitle, true);
    await pageValidations.seeElementContains(testCases.testCases, 'Test Cases', true);
    await pageActions.clickOn(homePage.apiTestingLink);
    await pageValidations.seeTitleContains(apiTesting.pageTitle, true);
    await pageValidations.seeElementContains(apiTesting.apiListForPractice, 'APIs List for practice', true);
    await pageActions.clickOn(homePage.contactUs);
    await pageValidations.seeTitleContains(contactUs.pageTitle, true);
    await pageValidations.seeElementContains(contactUs.getInTouch, 'Get In Touch', true);
    await pageActions.clickOn(homePage.videoTutorialLink);
    await pageValidations.seeElementContains(video.automatioExcercise, 'AutomationExercise', true);
});
