export const TIMEOUTS = {
    DEFAULT: 5000,
    VISIBILITY: 10000,
    NAVIGATION: 15000,
    API_TIMEOUT: 30000,
};

export const API_ENDPOINTS = {
    CREATE_ACCOUNT: '/api/createAccount',
    DELETE_ACCOUNT: '/api/deleteAccount',
    VERIFY_LOGIN: '/api/verifyLogin',
    PRODUCTS_LIST: '/api/productsList',
};

export const MESSAGES = {
    SEARCHED_PRODUCTS: 'SEARCHED PRODUCTS',
    ORDER_PLACED: 'ORDER PLACED!',
    ORDER_CONFIRMED: 'Order Placed!',
    PAYMENT_SUCCESS: 'Your order has been placed successfully!',
};

export const PAGE_TITLES = {
    ALL_PRODUCTS: /Automation Exercise - All Products/,
    CHECKOUT: /Automation Exercise - Checkout/,
    PAYMENT: /Automation Exercise - Payment/,
    ORDER_CONFIRMED: /Automation Exercise - Order Placed/,
};

export const PAYMENT_INFO = {
    NAME_ON_CARD: 'Test User',
    CARD_NUMBER: '4111111111111111',
    CVC: '123',
    EXPIRY_MONTH: '12',
    EXPIRY_YEAR: '2025',
};
