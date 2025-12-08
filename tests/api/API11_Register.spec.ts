import { test } from '../../src/fixtures';
import { DataFactory } from '../../src/utils/DataFactory';

test.describe('API 11: User Registration', { tag: ['@api', '@regression', '@Abdykarimov'] }, () => {
    test('POST To Create/Register User Account', async ({ userApiSteps }) => {
        const user = DataFactory.generateUser();
        await userApiSteps.registerUser(user);
    });
});