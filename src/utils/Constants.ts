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
    SEARCH_PRODUCT: '/api/searchProduct',
};

export const MESSAGES = {
    SEARCHED_PRODUCTS: 'SEARCHED PRODUCTS',
    ORDER_PLACED: 'ORDER PLACED!',
    ORDER_CONFIRMED: 'Order Placed!',
    PAYMENT_SUCCESS: 'Your order has been placed successfully!',
    CONTACT_SUCCESS: 'Success! Your details have been submitted successfully.',
};

export const URLS = {
    CONTACT_US: '/contact_us',
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

export const API_STATUS_CODES = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    METHOD_NOT_ALLOWED: 405,
    INTERNAL_SERVER_ERROR: 500,
};

export const ERROR_MESSAGES = {
    NO_PRODUCTS_FOUND: 'No products found for search term',
    PRODUCT_VERIFICATION_FAILED: 'Product verification failed',
    UNEXPECTED_PRODUCTS_FOUND: 'Expected no products, but found',
    PRODUCT_COUNT_MISMATCH: 'Expected more than',
};

export const API_MESSAGES = {
    METHOD_NOT_SUPPORTED: 'This request method is not supported.',
};

export const API_RESPONSE_KEYS = {
    PRODUCTS: 'products',
    RESPONSE_CODE: 'responseCode',
    MESSAGE: 'message',
};
