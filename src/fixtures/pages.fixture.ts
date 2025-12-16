import { Page } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { SignupPage } from '../pages/SignupPage';
import { AccountCreatedPage } from '../pages/AccountCreatedPage';
import { ProductsPage } from '../pages/ProductsPage';
import { ProductDetailPage } from '../pages/ProductDetailPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { PaymentPage } from '../pages/PaymentPage';
import { PaymentDonePage } from '../pages/PaymentDonePage';
import { ContactUsPage } from '../pages/ContactUsPage';
import { AccountDeletedPage } from '../pages/AccountDeletedPage';
import { NavigationMenu } from '../components/NavigationMenu';

export type PageFixtures = {
  navigation: NavigationMenu;
  homePage: HomePage;
  loginPage: LoginPage;
  signupPage: SignupPage;
  accountCreatedPage: AccountCreatedPage;
  productsPage: ProductsPage;
  productDetailPage: ProductDetailPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  paymentPage: PaymentPage;
  paymentDonePage: PaymentDonePage;
  contactUsPage: ContactUsPage;
  accountDeletedPage: AccountDeletedPage;
};

export const pageFixtures = {
  navigation: async ({ page }: { page: Page }, use: (n: NavigationMenu) => Promise<void>) => {
    await use(new NavigationMenu(page));
  },
  homePage: async ({ page, navigation }: { page: Page; navigation: NavigationMenu }, use: (p: HomePage) => Promise<void>) => {
    await use(new HomePage(page, navigation));
  },
  loginPage: async ({ page }: { page: Page }, use: (p: LoginPage) => Promise<void>) => {
    await use(new LoginPage(page));
  },
  signupPage: async ({ page }: { page: Page }, use: (p: SignupPage) => Promise<void>) => {
    await use(new SignupPage(page));
  },
  accountCreatedPage: async ({ page }: { page: Page }, use: (p: AccountCreatedPage) => Promise<void>) => {
    await use(new AccountCreatedPage(page));
  },
  productsPage: async ({ page }: { page: Page }, use: (p: ProductsPage) => Promise<void>) => {
    await use(new ProductsPage(page));
  },
  productDetailPage: async ({ page }: { page: Page }, use: (p: ProductDetailPage) => Promise<void>) => {
    await use(new ProductDetailPage(page));
  },
  cartPage: async ({ page }: { page: Page }, use: (p: CartPage) => Promise<void>) => {
    await use(new CartPage(page));
  },
  checkoutPage: async ({ page }: { page: Page }, use: (p: CheckoutPage) => Promise<void>) => {
    await use(new CheckoutPage(page));
  },
  paymentPage: async ({ page }: { page: Page }, use: (p: PaymentPage) => Promise<void>) => {
    await use(new PaymentPage(page));
  },
  paymentDonePage: async ({ page }: { page: Page }, use: (p: PaymentDonePage) => Promise<void>) => {
    await use(new PaymentDonePage(page));
  },
  contactUsPage: async ({ page }: { page: Page }, use: (p: ContactUsPage) => Promise<void>) => {
    await use(new ContactUsPage(page));
  },
  accountDeletedPage: async ({ page }: { page: Page }, use: (p: AccountDeletedPage) => Promise<void>) => {
    await use(new AccountDeletedPage(page));
  },
};