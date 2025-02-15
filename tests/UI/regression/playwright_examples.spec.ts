import { test } from '@playwright/test';
import { PageActionsHelper } from '../../../src/helpers/page-actions-helpers';
import { PageValidationsHelper } from '../../../src/helpers/page-validations-helpers';
import { ap } from '../../../src/selectors/automation-practice';

let pageActions: any;
let pageValidations: any;

test('Getting value from input editable element using common function @playwright', async ({ page }) => {
    pageActions = new PageActionsHelper(page);
    pageValidations = new PageValidationsHelper(page);
    await pageActions.navigateTo('https://testautomationpractice.blogspot.com/');
    await pageValidations.seeTitleContains(ap.pageTitle, true);
    await pageActions.fillField(ap.name, 'Test');
    await pageActions.fillField(ap.email, 'test@gmail.com');
    await pageValidations.seeElementState(ap.name, 'Test', true);
});

test('Check the radio button is selected or unselected using common function @playwright', async ({ page }) => {
    pageActions = new PageActionsHelper(page);
    pageValidations = new PageValidationsHelper(page);
    await pageActions.navigateTo('https://testautomationpractice.blogspot.com/');
    await pageValidations.seeTitleContains(ap.pageTitle, true);
    await pageActions.fillField(ap.name, 'Test');
    await pageActions.fillField(ap.email, 'test@gmail.com');
    await pageValidations.seeElementState(ap.name, 'Test', true);
    await pageActions.clickOn(ap.genderMale);
    await pageValidations.seeElementState(ap.genderMale, true);
    await pageActions.clickOn(ap.genderFemale);
    await pageValidations.seeElementState(ap.genderMale, false);
});

test('Check the List is sorted @playwright', async ({ page }) => {
    pageActions = new PageActionsHelper(page);
    pageValidations = new PageValidationsHelper(page);
    await pageActions.navigateTo('https://testautomationpractice.blogspot.com/');
    await pageValidations.seeTitleContains(ap.pageTitle, true);
    await pageActions.fillField(ap.name, 'Test');
    await pageActions.fillField(ap.email, 'test@gmail.com');
    await pageValidations.seeElementState(ap.name, 'Test', true);
    await pageActions.clickOn(ap.genderMale);
    await pageValidations.seeElementState(ap.genderMale, true);
    await pageActions.clickOn(ap.genderFemale);
    await pageValidations.seeElementState(ap.genderMale, false);
    const listWebElements = await pageActions.getAllElements(ap.animals);
    const actualList: any = [];
    for (let i = 0; i < listWebElements.length; i++) {
        
        actualList.push(await pageActions.getElementText(listWebElements[i]));
    }
    const cleanedAnimals = actualList.map(ele => ele.trim());
    const originalArray = [...cleanedAnimals];
    const soretdArray = cleanedAnimals.sort();

    for ( let i = 0; i < originalArray.length; i++) {
        if (originalArray[i] !== soretdArray[i]) {
            throw new Error(`List is not soretd, expected: ${soretdArray[i]} but found: ${originalArray[i]}`);
        }
    }
});

test('Select dropdown values @playwright', async ({ page }) => {
    pageActions = new PageActionsHelper(page);
    pageValidations = new PageValidationsHelper(page);
    await pageActions.navigateTo('https://testautomationpractice.blogspot.com/');
    await pageValidations.seeTitleContains(ap.pageTitle, true);
    await pageActions.fillField(ap.name, 'Test');
    await pageActions.fillField(ap.email, 'test@gmail.com');
    await pageValidations.seeElementState(ap.name, 'Test', true);
    await pageActions.clickOn(ap.genderMale);
    await pageValidations.seeElementState(ap.genderMale, true);
    await pageActions.clickOn(ap.genderFemale);
    await pageValidations.seeElementState(ap.genderMale, false);
    await pageActions.selectOption(ap.country, 'Canada');
});

test('Uploading a file @playwright', async ({ page }) => {
    pageActions = new PageActionsHelper(page);
    pageValidations = new PageValidationsHelper(page);
    await pageActions.navigateTo('https://testautomationpractice.blogspot.com/');
    await pageValidations.seeTitleContains(ap.pageTitle, true);
    await pageActions.fillField(ap.name, 'Test');
    await pageActions.fillField(ap.email, 'test@gmail.com');
    await pageValidations.seeElementState(ap.name, 'Test', true);
    await pageActions.clickOn(ap.genderMale);
    await pageValidations.seeElementState(ap.genderMale, true);
    await pageActions.clickOn(ap.genderFemale);
    await pageValidations.seeElementState(ap.genderMale, false);
    await pageActions.selectOption(ap.country, 'Canada');
    await pageActions.uploadFile(ap.uploadFile, 'sampleFile.jpg');
});

test('Validating static tables based on book name and row number @playwright', async ({ page }) => {
    pageActions = new PageActionsHelper(page);
    pageValidations = new PageValidationsHelper(page);
    await pageActions.navigateTo('https://testautomationpractice.blogspot.com/');
    await pageValidations.seeTitleContains(ap.pageTitle, true);
    await pageActions.fillField(ap.name, 'Test');
    await pageActions.fillField(ap.email, 'test@gmail.com');
    await pageValidations.seeElementState(ap.name, 'Test', true);
    await pageActions.clickOn(ap.genderMale);
    await pageValidations.seeElementState(ap.genderMale, true);
    await pageActions.clickOn(ap.genderFemale);
    await pageValidations.seeElementState(ap.genderMale, false);
    await pageValidations.seeElementState(ap.staticTable('Learn Selenium', 1), 'Amit', true);
    await pageValidations.seeElementState(ap.staticTable('Learn Selenium', 2), 'Selenium', true);
    await pageValidations.seeElementState(ap.staticTable('Learn Java', 3), '500', true);
    await pageValidations.seeElementState(ap.staticTable('Master In Selenium', 3), '3000', true);
    await pageValidations.seeElementState(ap.staticTable('Master In JS', 2), 'Javascript', true);
    await pageValidations.seeElementState(ap.staticTable('Learn JS', 1), 'Animesh', true);
});

test('Validating dynamic tables based on browser name and get all other values @playwright', async ({ page }) => {
    pageActions = new PageActionsHelper(page);
    pageValidations = new PageValidationsHelper(page);
    await pageActions.navigateTo('https://testautomationpractice.blogspot.com/');
    await pageValidations.seeTitleContains(ap.pageTitle, true);
    await pageActions.fillField(ap.name, 'Test');
    await pageActions.fillField(ap.email, 'test@gmail.com');
    await pageValidations.seeElementState(ap.name, 'Test', true);
    await pageActions.clickOn(ap.genderMale);
    await pageValidations.seeElementState(ap.genderMale, true);
    await pageActions.clickOn(ap.genderFemale);
    await pageValidations.seeElementState(ap.genderMale, false);
    
    const browserName = ['Chrome','Firefox', 'Internet Explorer', 'System']; // browser names
    const columnName = ['CPU (%)', 'Network (Mbps)', 'Memory (MB)', 'Disk (MB/s)']; // The values we need

    for (let i = 0; i < browserName.length; i++) {

        for (let j = 0; j < columnName.length; j++) {
            const columnXPath = ap.dynamicColumn(columnName[j]);
            const columnCount = await pageActions.getElementCount(columnXPath);
            const columnIndex = columnCount + 1; // using the preceding-sibling, hence index of element will always be +1
            const valueXPath = ap.columnValue(browserName[i], columnIndex);
            const value = await pageActions.getText(valueXPath);
            console.log(`${browserName[i]} ${columnName[j]} is ${value}`);

        }
    }
});

test('Handling Alerts @playwright', async ({ page }) => {
    pageActions = new PageActionsHelper(page);
    pageValidations = new PageValidationsHelper(page);
    await pageActions.navigateTo('https://testautomationpractice.blogspot.com/');
    await pageValidations.seeTitleContains(ap.pageTitle, true);
    await pageActions.fillField(ap.name, 'Test');
    await pageActions.fillField(ap.email, 'test@gmail.com');
    await pageValidations.seeElementState(ap.name, 'Test', true);
    await pageActions.clickOn(ap.genderMale);
    await pageValidations.seeElementState(ap.genderMale, true);
    await pageActions.clickOn(ap.genderFemale);
    await pageValidations.seeElementState(ap.genderMale, false);
    
    // handling simple alerts
    await pageActions.clickOn(ap.simpleALert);
    await pageActions.alert('accept');
});


test('Handling Confirm Alerts @playwright', async ({ page }) => {
    pageActions = new PageActionsHelper(page);
    pageValidations = new PageValidationsHelper(page);
    await pageActions.navigateTo('https://testautomationpractice.blogspot.com/');
    await pageValidations.seeTitleContains(ap.pageTitle, true);
    await pageActions.fillField(ap.name, 'Test');
    await pageActions.fillField(ap.email, 'test@gmail.com');
    await pageValidations.seeElementState(ap.name, 'Test', true);
    await pageActions.clickOn(ap.genderMale);
    await pageValidations.seeElementState(ap.genderMale, true);
    await pageActions.clickOn(ap.genderFemale);
    await pageValidations.seeElementState(ap.genderMale, false);
    
    // handling confirm alerts
    await pageActions.clickOn(ap.confirmAlert);
    await pageActions.alert('accept');
});

test('Handling prompt Alerts @playwright', async ({ page }) => {
    pageActions = new PageActionsHelper(page);
    pageValidations = new PageValidationsHelper(page);
    await pageActions.navigateTo('https://testautomationpractice.blogspot.com/');
    await pageValidations.seeTitleContains(ap.pageTitle, true);
    await pageActions.fillField(ap.name, 'Test');
    await pageActions.fillField(ap.email, 'test@gmail.com');
    await pageValidations.seeElementState(ap.name, 'Test', true);
    await pageActions.clickOn(ap.genderMale);
    await pageValidations.seeElementState(ap.genderMale, true);
    await pageActions.clickOn(ap.genderFemale);
    await pageValidations.seeElementState(ap.genderMale, false);
    
    // handling confirm alerts
    await pageActions.clickOn(ap.promptAlert);
    await pageActions.alert('prompt-accept', 'Syed Test');
});

test('Drag and drop @playwright', async ({ page }) => {
    pageActions = new PageActionsHelper(page);
    pageValidations = new PageValidationsHelper(page);
    await pageActions.navigateTo('https://testautomationpractice.blogspot.com/');
    await pageValidations.seeTitleContains(ap.pageTitle, true);
    await pageActions.fillField(ap.name, 'Test');
    await pageActions.fillField(ap.email, 'test@gmail.com');
    await pageValidations.seeElementState(ap.name, 'Test', true);
    await pageActions.clickOn(ap.genderMale);
    await pageValidations.seeElementState(ap.genderMale, true);
    await pageActions.clickOn(ap.genderFemale);
    await pageValidations.seeElementState(ap.genderMale, false);
    await pageActions.dragElment(ap.draggable, ap.droppable);
});

