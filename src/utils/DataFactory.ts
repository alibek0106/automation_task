import { faker } from '@faker-js/faker';
import { User } from '../models/UserModels';

export class DataFactory {
    static generateUser(): User {
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();

        return {
            name: `${firstName} ${lastName}`,
            email: faker.internet.email({ firstName, lastName, provider: `test${Date.now()}.com` }),
            password: faker.internet.password({ length: 10 }),
            title: faker.helpers.arrayElement(['Mr', 'Mrs']),
            firstName: firstName,
            lastName: lastName,
            company: faker.company.name(),
            address1: faker.location.streetAddress(),
            address2: faker.location.secondaryAddress(),
            country: 'United States', // Fixed for dropdown selection
            state: faker.location.state(),
            city: faker.location.city(),
            zipcode: faker.location.zipCode(),
            mobileNumber: faker.phone.number(),
            birthDay: String(faker.number.int({ min: 1, max: 28 })),
            birthMonth: faker.date.month(),
            birthYear: String(faker.number.int({ min: 1980, max: 2000 })),
        };
    }
}