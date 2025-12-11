import { faker } from '@faker-js/faker';

export class RandomDataGenerator {
    static getFirstName(): string {
        return faker.person.firstName();
    }

    static getLastName(): string {
        return faker.person.lastName();
    }

    static getRandomString(length: number): string {
        return faker.string.alphanumeric(length);
    }

    static getEmail(firstName: string, lastName: string, uniqueSuffix: string): string {
        return faker.internet.email({ firstName, lastName, provider: `test${uniqueSuffix}.com` });
    }

    static getPassword(length: number): string {
        return faker.internet.password({ length });
    }

    static getRandomElement<T>(array: T[]): T {
        return faker.helpers.arrayElement(array);
    }

    static getCompanyName(): string {
        return faker.company.name();
    }

    static getAddress(): string {
        return faker.location.streetAddress();
    }

    static getSecondaryAddress(): string {
        return faker.location.secondaryAddress();
    }

    static getCity(): string {
        return faker.location.city();
    }

    static getState(): string {
        return faker.location.state();
    }

    static getZipCode(): string {
        return faker.location.zipCode();
    }

    static getPhoneNumber(): string {
        return faker.phone.number();
    }

    static getNumber(min: number, max: number): number {
        return faker.number.int({ min, max });
    }

    static getMonth(): string {
        return faker.date.month();
    }

    // Payment Helpers
    static getCreditCardNumber(): string {
        return faker.finance.creditCardNumber();
    }

    static getCreditCardCVC(): string {
        return faker.finance.creditCardCVV();
    }
}