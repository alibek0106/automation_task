import { User, AccountDetails, AddressInfo } from '../../utils/DataFactory';
import { AutomationExerciseApi } from '../AutomationExerciseApi';

export class UserApiSteps {
    constructor(private automationExerciseApi: AutomationExerciseApi) { }

    async registerUser(user: { name: string, email: string }, account: AccountDetails, address: AddressInfo) {
        // Map deeply nested objects to User type for API
        const userData: User = {
            name: user.name,
            email: user.email,
            password: account.password,
            title: account.title,
            day: account.day,
            month: account.month,
            year: account.year,
            firstName: address.firstName,
            lastName: address.lastName,
            company: address.company,
            address: address.address,
            address2: address.address2,
            country: address.country,
            zipcode: address.zipcode,
            state: address.state,
            city: address.city,
            mobileNumber: address.mobileNumber
        };

        await this.automationExerciseApi.registerUser(userData);
    }

    async deleteUser(email: string, password: string) {
        await this.automationExerciseApi.deleteUser(email, password);
    }

    async getUserDetails(email: string): Promise<any> {
        return await this.automationExerciseApi.getUserDetails(email);
    }
}
