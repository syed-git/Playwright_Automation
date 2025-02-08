import { test } from '@playwright/test';
import { PageActionsHelper } from '../../../src/helpers/page-actions-helpers';
import { homePage } from '../../../src/selectors/hoome-page';
import { PageValidationsHelper } from '../../../src/helpers/page-validations-helpers';
import { env } from '../../../environments/environment';
import { products } from '../../../src/selectors/products';


test('Verify product details - #products', async ({ page }) => {

    const pageActions = new PageActionsHelper(page);
    const pageValidations = new PageValidationsHelper(page);
    
    await pageActions.navigateTo(env.sit.baseUrl);
    await pageValidations.seeTitleContains(homePage.pageTitle, true);
    await pageValidations.seeElementExists(homePage.home);
    await pageActions.clickOn(homePage.productsLink);
    await pageValidations.seeTitleContains(products.pageTitle, true);
    await pageValidations.seeElementContains(products.allProducts, 'All Products', true);
    await pageActions.clickOn(products.viewProduct(1));
    await pageValidations.seeElementExists(products.productName);
    await pageValidations.seeElementExists(products.category);
    await pageValidations.seeElementExists(products.price);
    await pageValidations.seeElementExists(products.availability);
    await pageValidations.seeElementExists(products.condition);
    await pageValidations.seeElementExists(products.brand);
});
