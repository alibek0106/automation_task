/**
 * User data type definitions for test automation
 */

export interface UserAccountInfo {
    title: 'Mr' | 'Mrs';
    password: string;
    dateOfBirth: {
        day: string;
        month: string;
        year: string;
    };
    newsletter: boolean;
    specialOffers: boolean;
}

export interface UserAddressInfo {
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

export interface UserCredentials {
    email: string;
    password: string;
    name: string;
}

export interface CompleteUserData {
    credentials: UserCredentials;
    accountInfo: UserAccountInfo;
    addressInfo: UserAddressInfo;
}

export interface StoredUserData {
    workerId: string;
    credentials: UserCredentials;
    createdAt: string;
}
