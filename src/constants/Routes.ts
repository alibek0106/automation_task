export const Routes = {
    WEB: {
        HOME: '/',
        LOGIN: '/login',
        SIGNUPT: '/signup',
        ACCOUNT_CREATED: '/account_created',
    },
    API: {
        CREATE_ACCOUNT: '/api/createAccount',
        VERIFY_LOGIN: '/api/verifyLogin',
    },
} as const;