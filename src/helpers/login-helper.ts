import { PageActionsHelper } from "./page-actions-helpers";
import { env } from '../../environments/environment'
import { homePage } from "../selectors/hoome-page";
import { signUp } from "../selectors/sign-up";

export class LoginHelper extends PageActionsHelper {

    async loginToApplcation(url: string = env.sit.baseUrl, userName: string = env.sit.userName, password: string = env.sit.password) {
        await this.navigateTo(url);
        await this.seeTitleContains(homePage.pageTitle, true);
        await this.seeElementExists(homePage.home);
        await this.clickOn(homePage.signUpButton);
        await this.seeTitleContains(signUp.pageTitle, true);
        await this.seeElementPresent(signUp.newUserSignUp, 'visible');
        await this.seeElementExists(signUp.loginToYourAccount);
        await this.fillField(signUp.loginEmail, userName);
        await this.enterPassword(signUp.loginPassword, password);
        await this.clickOn(signUp.loginButton);
        await this.seeElementContains(homePage.loggedInAs, 'Syed Zubair');
    }

    async logout() {
        await this.clickOn(homePage.logout);
        await this.seeElementDoesNotExists(homePage.loggedInAs);
    }

    async registerUser(testData: any) {
        await this.navigateTo(env.sit.baseUrl);
        await this.seeTitleContains(homePage.pageTitle);
        await this.seeElementExists(homePage.home);
        await this.clickOn(homePage.signUpButton);
        await this.seeTitleContains(signUp.pageTitle, true);
        await this.seeElementPresent(signUp.newUserSignUp, 'visible');
        await this.seeElementExists(signUp.loginToYourAccount);
        await this.fillField(signUp.name, testData.name || env.sit.register.name);
        await this.fillField(signUp.signUpEmail, testData.email || env.sit.register.email);
        await this.clickOn(signUp.signUpButton);
        await this.seeElementContains(signUp.enterAccountInfo, 'Enter Account Information', true);
        await this.clickOn(signUp.title.mr);
        await this.enterPassword(signUp.password, testData.password || env.sit.register.password);
        await this.selectOption(signUp.dobDay, {value: testData.date || env.sit.register.date});
        await this.selectOption(signUp.dobMonth, {index: testData.month || env.sit.register.month});
        await this.selectOption(signUp.dobYear, {value: testData.year || env.sit.register.year});
        await this.clickOn(signUp.newsLetterCheckbox);
        await this.clickOn(signUp.receiveSpecialOffer);
        await this.fillField(signUp.fisrtName, testData.fisrtName || env.sit.register.fisrtName);
        await this.fillField(signUp.lastName, testData.lastName || env.sit.register.lastName);
        await this.fillField(signUp.company, testData.company || env.sit.register.company);
        await this.fillField(signUp.address1, testData.address1 || env.sit.register.address1);
        await this.fillField(signUp.address2, testData.address2 || env.sit.register.address2);
        await this.selectOption(signUp.country, {value: 'India'});
        await this.fillField(signUp.state, testData.state || env.sit.register.state);
        await this.fillField(signUp.city, testData.city || env.sit.register.city);
        await this.fillField(signUp.zipCode, testData.zipCode || env.sit.register.zipCode);
        await this.fillField(signUp.mobileNumber, testData.mobile || env.sit.register.mobile);
        await this.clickOn(signUp.createAccount);
        await this.seeElementContains(signUp.accountCreated, 'Account Created!', true);
        await this.clickOn(signUp.continueButton);
        await this.seeElementContains(homePage.loggedInAs, testData.fisrtName || env.sit.register.fisrtName);
        return true
    } 
    
    async deleteAccount() {
        await this.seeElementExists(homePage.deleteAccount);
        await this.clickOn(homePage.deleteAccount);
        await this.seeElementContains(homePage.accountDeleted, 'Account Deleted!', true);
        await this.clickOn(homePage.continueButton);
    }
}


