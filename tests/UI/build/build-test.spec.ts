import { test } from '@playwright/test';
import { LoginHelper } from '../../../src/helpers/login-helper';


test('Login to Application with valid credentials - #build', async ({ page }) => {

    const loginHelper = new LoginHelper(page);

    await loginHelper.loginToApplcation();
    await loginHelper.logout();
});

test('Register a user - #build', async ({ page }) => {

    const loginHelper = new LoginHelper(page);

    const flag = await loginHelper.registerUser(undefined);
    if (flag) {
        await loginHelper.deleteAccount();
    }
});
