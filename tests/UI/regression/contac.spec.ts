import { test, expect } from '@playwright/test';
import { PageActionsHelper } from '../../../src/helpers/page-actions-helpers';

test('test #demo', async ({ page }) => {
const pageActions = new PageActionsHelper(page);

  await page.goto('https://automationexercise.com/');
  await page.getByRole('link', { name: ' Contact us' }).click();
  await page.getByRole('textbox', { name: 'Name' }).click();
  await page.getByRole('textbox', { name: 'Name' }).fill('Syed Zubair');
  await page.getByRole('textbox', { name: 'Name' }).press('Tab');
  await page.getByRole('textbox', { name: 'Email', exact: true }).fill('syedzubair4929@gmail.com');
  await page.getByRole('textbox', { name: 'Email', exact: true }).press('Tab');
  await page.getByRole('textbox', { name: 'Subject' }).fill('query on refund');
  await page.getByRole('textbox', { name: 'Subject' }).press('Tab');
  await page.getByRole('textbox', { name: 'Your Message Here' }).fill('did not receive query');
  await page.getByRole('textbox', { name: 'Your Message Here' }).press('Tab');
    await pageActions.uploadFile('input[name="upload_file"]', 'sampleFile.jpg');
  
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page.getByRole('button', { name: 'Submit' }).click();
  await page.locator('#contact-page').getByText('Success! Your details have').click();
  await page.getByRole('link', { name: ' Home' }).click();
});