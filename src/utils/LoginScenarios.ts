export interface LoginScenario {
    desc: string;
    email: string;
    pass: string;
    expectedApiMsg: string;
    responseCode: number;
}

export const LOGIN_NEGATIVE_SCENARIOS: LoginScenario[] = [
    {
        desc: 'Wrong Password',
        email: 'valid',
        pass: 'wrongpass',
        expectedApiMsg: 'User not found!',
        responseCode: 404
    },
    {
        desc: 'Non-exist Email',
        email: 'fake@x.com',
        pass: '123456',
        expectedApiMsg: 'User not found!',
        responseCode: 404
    },
    {
        desc: 'Empty Password',
        email: 'valid',
        pass: '',
        expectedApiMsg: 'User not found!',
        responseCode: 404
    }
];