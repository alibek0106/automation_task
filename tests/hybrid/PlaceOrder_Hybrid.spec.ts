import { isolatedTest as test, expect } from "../../src/fixtures";
import { PRODUCT_NAMES } from "../../src/constants/ProductData";
import { DataFactory } from "../../src/utils/DataFactory";

test.describe('Place Order (Hybrid)', { tag: ['@Abdykarimov', '@Hybrid', '@Checkout'] }, () => {
    test('Should place order successfully with API-created user', async ({
        context,
        userApiSteps,
        cartSteps,
        checkoutSteps,
        checkoutPage,
    }) => {
        // Prepare data
        const user = DataFactory.generateUser();
        const paymentData = DataFactory.generatePaymentDetails();
        const productToBuy = PRODUCT_NAMES[0];
        const orderComment = 'Hybrid Test Order - Auto generated';

        // API Register + Login
        await userApiSteps.createAndLoginUser(user, context);

        // Add to Cart (UI)
        await cartSteps.addProductAndGoToCart(productToBuy);

        // Checkout Flow
        await checkoutSteps.proceedToCheckoutSuccess();

        await test.step('Verify Delivery Address matches API User data', async () => {
            await expect(checkoutPage.deliveryAddressSection, 'Delivery address section should match expected').toContainText(user.address1);
            await expect(checkoutPage.deliveryAddressSection, 'Delivery address section should contain expected city').toContainText(user.city);
            await expect(checkoutPage.deliveryAddressSection, 'Delivery address section should contain expected zip code').toContainText(user.zipcode);
        });

        // Place Order
        await checkoutSteps.placeOrder(orderComment);

        // Payment Flow
        await checkoutSteps.enterPaymentAndConfirm(paymentData);
    });
});