import { test } from '../../src/fixtures';
import { DataFactory } from '../../src/utils/DataFactory';

test.describe('API 12: Account Management', { tag: ['@api', '@regression'] }, () => {

    test('DELETE To Delete User Account', async ({ userApiSteps }) => {
        const user = DataFactory.generateUser();
        await userApiSteps.registerUser(user);
        await userApiSteps.deleteUser(user.email, user.password);
    });
});