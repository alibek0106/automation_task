import { test as base } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { SignupLoginPage } from '../pages/SignupLoginPage';
import { SignupPage } from '../pages/SignupPage';
import { AccountCreatedPage } from '../pages/AccountCreatedPage';
import { ProductsPage } from '../pages/ProductsPage';
import { ProductDetailsPage } from '../pages/ProductDetailsPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { PaymentPage } from '../pages/PaymentPage';

type PageFixtures = {
  homePage: HomePage;
  signupLoginPage: SignupLoginPage;
  signupPage: SignupPage;
  accountCreatedPage: AccountCreatedPage;
  productsPage: ProductsPage;
  productDetailsPage: ProductDetailsPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  paymentPage: PaymentPage;
};

export const test = base.extend<PageFixtures>({

  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await use(homePage);
  },

  signupLoginPage: async ({ page }, use) => {
    const signupLoginPage = new SignupLoginPage(page);
    await use(signupLoginPage);
  },

  signupPage: async ({ page }, use) => {
    const signupPage = new SignupPage(page);
    await use(signupPage);
  },

  accountCreatedPage: async ({ page }, use) => {
    const accountCreatedPage = new AccountCreatedPage(page);
    await use(accountCreatedPage);
  },

  productsPage: async ({ page }, use) => {
    const productsPage = new ProductsPage(page);
    await use(productsPage);
  },

  productDetailsPage: async ({ page }, use) => {
    const productDetailsPage = new ProductDetailsPage(page);
    await use(productDetailsPage);
  },

  cartPage: async ({ page }, use) => {
    const cartPage = new CartPage(page);
    await use(cartPage);
  },

  checkoutPage: async ({ page }, use) => {
    const checkoutPage = new CheckoutPage(page);
    await use(checkoutPage);
  },

  paymentPage: async ({ page }, use) => {
    const paymentPage = new PaymentPage(page);
    await use(paymentPage);
  },
});

export { expect } from '@playwright/test';
