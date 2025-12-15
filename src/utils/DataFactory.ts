import { faker } from '@faker-js/faker';
import { USER_CONSTANTS } from '../constants/UserConstants';

export interface User {
    name: string;
    email: string;
    password: string;
    title: 'Mr.' | 'Mrs.';
    day: string;
    month: string;
    year: string;
    firstName: string;
    lastName: string;
    company: string;
    address: string;
    address2: string;
    country: string;
    state: string;
    city: string;
    zipcode: string;
    mobileNumber: string;
}

export type AccountDetails = ReturnType<typeof DataFactory.generateAccountDetails>;
export type AddressInfo = ReturnType<typeof DataFactory.generateAddressInfo>;

export class DataFactory {
    static generateUser() {
        // Use consistent formatting for easier debugging
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const email = faker.internet.email({ firstName, lastName, provider: USER_CONSTANTS.EMAIL_PROVIDER });

        return {
            name: `${firstName} ${lastName}`,
            email: email.toLowerCase(),
            password: USER_CONSTANTS.DEFAULT_PASSWORD, // Default strong password
            firstName,
            lastName
        };
    }

    static generateAccountDetails() {
        return {
            title: faker.helpers.arrayElement([USER_CONSTANTS.TITLES.MR, USER_CONSTANTS.TITLES.MRS]) as 'Mr.' | 'Mrs.',
            password: USER_CONSTANTS.DEFAULT_PASSWORD,
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
            country: USER_CONSTANTS.COUNTRY, // Restricted list in app
            state: faker.location.state(),
            city: faker.location.city(),
            zipcode: faker.location.zipCode(),
            mobileNumber: faker.phone.number()
        };
    }

    static generateFullUser(): User {
        const user = this.generateUser();
        const account = this.generateAccountDetails();
        const address = this.generateAddressInfo();

        return {
            ...user,
            ...account,
            ...address
        };
    }

    static generateContactFormData() {
        return {
            name: faker.person.fullName(),
            email: faker.internet.email(),
            subject: faker.lorem.sentence(3),
            message: faker.lorem.paragraph(1) // Ensure it meets length requirements if any
        };
    }
}