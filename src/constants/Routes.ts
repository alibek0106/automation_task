export const Routes = {
    WEB: {
        HOME: '/',
        LOGIN: '/login',
        SIGNUPT: '/signup',
        PRODUCTS: '/products',
        VIEW_CART: /\/view_cart/,
        ACCOUNT_CREATED: '/account_created',
        HOME_TITLE: 'Automation Exercise',
    },
    API: {
        CREATE_ACCOUNT: '/api/createAccount',
        VERIFY_LOGIN: '/api/verifyLogin',
    },
} as const;