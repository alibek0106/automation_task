import { RandomDataGenerator } from './RandomDataGenerator';
import { User } from '../models/UserModels';
import { PaymentDetails } from '../models/PaymentModels';

export class DataFactory {
    static generateUser(): User {
        const firstName = RandomDataGenerator.getFirstName();
        const lastName = RandomDataGenerator.getLastName();

        const uniqueSuffix = RandomDataGenerator.getRandomString(8);

        return {
            name: `${firstName} ${lastName}`,
            email: RandomDataGenerator.getEmail(firstName, lastName, uniqueSuffix),
            password: RandomDataGenerator.getPassword(10),
            title: RandomDataGenerator.getRandomElement(['Mr', 'Mrs']),
            firstName: firstName,
            lastName: lastName,
            company: RandomDataGenerator.getCompanyName(),
            address1: RandomDataGenerator.getAddress(),
            address2: RandomDataGenerator.getSecondaryAddress(),
            country: 'United States', // Fixed for dropdown selection
            state: RandomDataGenerator.getState(),
            city: RandomDataGenerator.getCity(),
            zipcode: RandomDataGenerator.getZipCode(),
            mobileNumber: RandomDataGenerator.getPhoneNumber(),
            birthDay: String(RandomDataGenerator.getNumber(1, 28)),
            birthMonth: RandomDataGenerator.getMonth(),
            birthYear: String(RandomDataGenerator.getNumber(1980, 2000)),
        };
    }
    static generatePaymentDetails(): PaymentDetails {
        return {
            nameOnCard: `${RandomDataGenerator.getFirstName()} ${RandomDataGenerator.getLastName()}`,
            cardNumber: RandomDataGenerator.getCreditCardNumber(),
            cvc: RandomDataGenerator.getCreditCardCVC(),
            expiryMonth: String(RandomDataGenerator.getNumber(1, 12)).padStart(2, '0'),
            expiryYear: String(RandomDataGenerator.getNumber(2025, 2030)),
        };
    }
}