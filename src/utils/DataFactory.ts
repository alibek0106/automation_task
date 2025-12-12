import { faker } from '@faker-js/faker';

export class DataFactory {
    static generateUser() {
        // Use consistent formatting for easier debugging
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const email = faker.internet.email({ firstName, lastName, provider: 'test.com' });

        return {
            name: `${firstName} ${lastName}`,
            email: email.toLowerCase(),
            password: 'StrongP@ss1!', // Default strong password
            firstName,
            lastName
        };
    }

    static generateAccountDetails() {
        return {
            title: faker.helpers.arrayElement(['Mr.', 'Mrs.']) as 'Mr.' | 'Mrs.',
            password: 'StrongP@ss1!',
            day: String(faker.number.int({ min: 1, max: 28 })),
            month: faker.date.month(),
            year: String(faker.number.int({ min: 1970, max: 2005 }))
        };
    }

    static generateAddressInfo() {
        return {
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            company: faker.company.name(),
            address: faker.location.streetAddress(),
            address2: faker.location.secondaryAddress(),
            country: 'United States', // Restricted list in app
            state: faker.location.state(),
            city: faker.location.city(),
            zipcode: faker.location.zipCode(),
            mobileNumber: faker.phone.number()
        };
    }
}