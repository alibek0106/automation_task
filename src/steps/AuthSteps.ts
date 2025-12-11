import { Page } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { HomePage } from "../pages/HomePage";
import { User } from "../models/UserModels";
import { expect } from "@playwright/test";

export class AuthSteps {
  constructor(
    private homePage: HomePage,
    private loginPage: LoginPage,
  ) { }

  /**
   * Navigates to login page and logs in via UI, then validates success.
   * Use this when you need to open the login page and perform login in one step.
   * If already on login page, use loginPage.login() directly instead.
   */
  async openAndLogin(user: User) {
    await this.homePage.goto();
    await this.homePage.clickSignupLogin();
    await this.loginPage.login(user.email, user.password);
    await expect(
      this.homePage.loggedInText,
      "Logged in text should contain user name",
    ).toContainText(user.name);
  }
}
