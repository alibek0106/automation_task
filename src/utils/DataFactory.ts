import { faker } from '@faker-js/faker';
import { User } from '../models/UserModels';
import { PaymentDetails } from '../models/PaymentModels';

export class DataFactory {
    static generateUser(): User {
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();

        const uniqueSuffix = faker.string.alphanumeric(8);

        return {
            name: `${firstName} ${lastName}`,
            email: faker.internet.email({ firstName, lastName, provider: `test${uniqueSuffix}.com` }),
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
    static generatePaymentDetails(): PaymentDetails {
        return {
            nameOnCard: faker.person.fullName(),
            cardNumber: faker.finance.creditCardNumber(),
            cvc: faker.finance.creditCardCVV(),
            expiryMonth: String(faker.number.int({ min: 1, max: 12 })).padStart(2, '0'),
            expiryYear: String(faker.number.int({ min: 2025, max: 2030 })),
        };
    }
}