import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../../framework/pages/BasePage';
import { UserAccountInfo, UserAddressInfo } from '../../types/UserData';

/**
 * SignupPage - Represents the account information and registration form page
 */
export class SignupPage extends BasePage {
  // Locators
  protected readonly uniqueElement: Locator;

  private readonly accountInfoHeading: Locator;
  private readonly titleMrRadio: Locator;
  private readonly titleMrsRadio: Locator;
  private readonly passwordInput: Locator;
  private readonly dayDropdown: Locator;
  private readonly monthDropdown: Locator;
  private readonly yearDropdown: Locator;
  private readonly newsletterCheckbox: Locator;
  private readonly specialOffersCheckbox: Locator;

  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly companyInput: Locator;
  private readonly addressInput: Locator;
  private readonly address2Input: Locator;
  private readonly countryDropdown: Locator;
  private readonly stateInput: Locator;
  private readonly cityInput: Locator;
  private readonly zipcodeInput: Locator;
  private readonly mobileNumberInput: Locator;

  private readonly createAccountButton: Locator;

  constructor(page: Page) {
    super(page);

    this.uniqueElement = page.getByText('Enter Account Information').first();

    this.accountInfoHeading = page.getByText('Enter Account Information').first();
    this.titleMrRadio = page.locator('#id_gender1');
    this.titleMrsRadio = page.locator('#id_gender2');
    this.passwordInput = page.getByTestId('password');
    this.dayDropdown = page.getByTestId('days');
    this.monthDropdown = page.getByTestId('months');
    this.yearDropdown = page.getByTestId('years');
    this.newsletterCheckbox = page.locator('#newsletter');
    this.specialOffersCheckbox = page.locator('#optin');

    this.firstNameInput = page.getByTestId('first_name');
    this.lastNameInput = page.getByTestId('last_name');
    this.companyInput = page.getByTestId('company');
    this.addressInput = page.getByTestId('address');
    this.address2Input = page.getByTestId('address2');
    this.countryDropdown = page.getByTestId('country');
    this.stateInput = page.getByTestId('state');
    this.cityInput = page.getByTestId('city');
    this.zipcodeInput = page.getByTestId('zipcode');
    this.mobileNumberInput = page.getByTestId('mobile_number');

    this.createAccountButton = page.getByTestId('create-account');
  }


  async verifyAccountInfoPageVisible(): Promise<void> {
    await this.verifyElementVisible(this.accountInfoHeading);
    await expect(this.accountInfoHeading).toContainText('Enter Account Information');
  }


  async selectTitle(title: 'Mr' | 'Mrs'): Promise<void> {
    if (title === 'Mr') {
      await this.clickElement(this.titleMrRadio);
    } else {
      await this.clickElement(this.titleMrsRadio);
    }
  }


  async fillPassword(password: string): Promise<void> {
    await this.fillInput(this.passwordInput, password);
  }

  async fillDateOfBirth(day: string, month: string, year: string): Promise<void> {
    await this.selectDropdown(this.dayDropdown, day);
    await this.selectDropdown(this.monthDropdown, month);
    await this.selectDropdown(this.yearDropdown, year);
  }

  async selectNewsletterCheckbox(): Promise<void> {
    await this.checkCheckbox(this.newsletterCheckbox);
  }

  async selectSpecialOffersCheckbox(): Promise<void> {
    await this.checkCheckbox(this.specialOffersCheckbox);
  }

  /**
   * Fill account information section
   */
  async fillAccountInformation(accountInfo: UserAccountInfo): Promise<void> {
    await this.selectTitle(accountInfo.title);
    await this.fillPassword(accountInfo.password);
    await this.fillDateOfBirth(
      accountInfo.dateOfBirth.day,
      accountInfo.dateOfBirth.month,
      accountInfo.dateOfBirth.year
    );

    if (accountInfo.newsletter) {
      await this.selectNewsletterCheckbox();
    }

    if (accountInfo.specialOffers) {
      await this.selectSpecialOffersCheckbox();
    }
  }

  /**
   * Fill address information section
   */
  async fillAddressInformation(addressInfo: UserAddressInfo): Promise<void> {
    await this.fillInput(this.firstNameInput, addressInfo.firstName);
    await this.fillInput(this.lastNameInput, addressInfo.lastName);
    await this.fillInput(this.companyInput, addressInfo.company);
    await this.fillInput(this.addressInput, addressInfo.address);
    await this.fillInput(this.address2Input, addressInfo.address2);
    await this.selectDropdown(this.countryDropdown, addressInfo.country);
    await this.fillInput(this.stateInput, addressInfo.state);
    await this.fillInput(this.cityInput, addressInfo.city);
    await this.fillInput(this.zipcodeInput, addressInfo.zipcode);
    await this.fillInput(this.mobileNumberInput, addressInfo.mobileNumber);
  }

  /**
   * Click Create Account button
   */
  async clickCreateAccount(): Promise<void> {
    await this.clickElement(this.createAccountButton);
  }

  /**
   * Complete registration form (fill all information and submit)
   */
  async completeRegistration(
    accountInfo: UserAccountInfo,
    addressInfo: UserAddressInfo
  ): Promise<void> {
    await this.verifyAccountInfoPageVisible();
    await this.fillAccountInformation(accountInfo);
    await this.fillAddressInformation(addressInfo);
    await this.clickCreateAccount();
  }
}
