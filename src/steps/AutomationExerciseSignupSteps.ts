import { AutomationExerciseSignupPage } from '../pages/AutomationExerciseSignupPage';
import { AccountCreatedPage } from '../pages/AccountCreatedPage';

export class AutomationExerciseSignupSteps {
    constructor(
        private signupPage: AutomationExerciseSignupPage,
        private accountCreatedPage: AccountCreatedPage
    ) { }

    async verifyAccountInfoPageOpened() {
        await this.signupPage.verifyAccountInfoPageOpened();
    }

    async fillAccountDetails(details: { title: 'Mr.' | 'Mrs.', password: string, day: string, month: string, year: string }) {
        await this.signupPage.selectTitle(details.title);
        await this.signupPage.enterPassword(details.password);
        await this.signupPage.selectDateOfBirth(details.day, details.month, details.year);
    }

    async selectNewsletter() {
        await this.signupPage.checkNewsletter();
    }

    async selectSpecialOffers() {
        await this.signupPage.checkSpecialOffers();
    }

    async fillAddressInfo(info: { firstName: string, lastName: string, company: string, address: string, address2: string, country: string, state: string, city: string, zipcode: string, mobileNumber: string }) {
        await this.signupPage.enterFirstName(info.firstName);
        await this.signupPage.enterLastName(info.lastName);
        await this.signupPage.enterCompany(info.company);
        await this.signupPage.enterAddress(info.address);
        await this.signupPage.enterAddress2(info.address2);
        await this.signupPage.selectCountry(info.country);
        await this.signupPage.enterState(info.state);
        await this.signupPage.enterCity(info.city);
        await this.signupPage.enterZipcode(info.zipcode);
        await this.signupPage.enterMobileNumber(info.mobileNumber);
    }

    async clickCreateAccount() {
        await this.signupPage.clickCreateAccount();
    }

    async verifyAccountCreated() {
        await this.accountCreatedPage.verifyAccountCreatedMessage();
    }

    async clickContinue() {
        await this.accountCreatedPage.clickContinue();
    }
}
