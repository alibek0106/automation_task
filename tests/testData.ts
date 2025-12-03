import { faker } from '@faker-js/faker';
import * as fs from 'fs';
import * as path from 'path';
import { CompleteUserData, StoredUserData, UserCredentials } from '../types/UserData';

/**
 * UserDataManager - Manages worker-specific user data for parallel test execution
 * Ensures each worker has unique credentials with no conflicts
 */
export class UserDataManager {
    private static readonly USER_DATA_DIR = path.join(__dirname, 'fixtures', 'users');

    /**
     * Ensure the user data directory exists
     */
    private static ensureDirectoryExists(): void {
        if (!fs.existsSync(this.USER_DATA_DIR)) {
            fs.mkdirSync(this.USER_DATA_DIR, { recursive: true });
        }
    }

    /**
     * Get the file path for a specific worker's user data
     */
    private static getWorkerFilePath(workerId: string): string {
        return path.join(this.USER_DATA_DIR, `worker-${workerId}.json`);
    }

    /**
     * Generate a unique email address using worker ID and timestamp
     */
    private static generateUniqueEmail(workerId: string): string {
        const timestamp = Date.now();
        const randomString = faker.string.alphanumeric(6).toLowerCase();
        return `testuser_w${workerId}_${timestamp}_${randomString}@automation.test`;
    }

    /**
     * Generate complete user data for a worker
     */
    static generateUniqueUser(workerId: string): CompleteUserData {
        const email = this.generateUniqueEmail(workerId);
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const name = `${firstName} ${lastName}`;

        return {
            credentials: {
                name: name,
                email: email,
                password: 'Test@12345',
            },
            accountInfo: {
                title: faker.helpers.arrayElement(['Mr', 'Mrs'] as const),
                password: 'Test@12345',
                dateOfBirth: {
                    day: faker.number.int({ min: 1, max: 28 }).toString(),
                    month: faker.date.month(),
                    year: faker.number.int({ min: 1970, max: 2000 }).toString(),
                },
                newsletter: true,
                specialOffers: true,
            },
            addressInfo: {
                firstName: firstName,
                lastName: lastName,
                company: faker.company.name(),
                address: faker.location.streetAddress(),
                address2: faker.location.secondaryAddress(),
                country: 'United States',
                state: faker.location.state(),
                city: faker.location.city(),
                zipcode: faker.location.zipCode('#####'),
                mobileNumber: faker.phone.number().replace(/\D/g, '').slice(0, 10),
            },
        };
    }

    /**
     * Save user credentials to worker-specific file
     */
    static saveUserCredentials(workerId: string, credentials: UserCredentials): void {
        this.ensureDirectoryExists();

        const storedData: StoredUserData = {
            workerId: workerId,
            credentials: credentials,
            createdAt: new Date().toISOString(),
        };

        const filePath = this.getWorkerFilePath(workerId);
        fs.writeFileSync(filePath, JSON.stringify(storedData, null, 2), 'utf-8');
    }

    /**
     * Load user credentials from worker-specific file
     */
    static loadUserCredentials(workerId: string): UserCredentials | null {
        const filePath = this.getWorkerFilePath(workerId);

        if (!fs.existsSync(filePath)) {
            return null;
        }

        try {
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            const storedData: StoredUserData = JSON.parse(fileContent);
            return storedData.credentials;
        } catch (error) {
            console.error(`Error loading user credentials for worker ${workerId}:`, error);
            return null;
        }
    }

    /**
     * Get user data for a specific worker
     * If credentials exist, load them; otherwise generate new user
     */
    static getUserDataForWorker(workerId: string): CompleteUserData {
        const existingCredentials = this.loadUserCredentials(workerId);

        if (existingCredentials) {
            // Return existing user data with loaded credentials
            const userData = this.generateUniqueUser(workerId);
            userData.credentials = existingCredentials;
            userData.accountInfo.password = existingCredentials.password;
            return userData;
        }

        // Generate new user data
        return this.generateUniqueUser(workerId);
    }

    /**
     * Check if user credentials exist for a worker
     */
    static hasUserCredentials(workerId: string): boolean {
        const filePath = this.getWorkerFilePath(workerId);
        return fs.existsSync(filePath);
    }

    /**
     * Delete user credentials for a worker (useful for cleanup)
     */
    static deleteUserCredentials(workerId: string): void {
        const filePath = this.getWorkerFilePath(workerId);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }

    /**
     * Clear all user credentials (useful for test cleanup)
     */
    static clearAllUserCredentials(): void {
        if (fs.existsSync(this.USER_DATA_DIR)) {
            const files = fs.readdirSync(this.USER_DATA_DIR);
            files.forEach(file => {
                fs.unlinkSync(path.join(this.USER_DATA_DIR, file));
            });
        }
    }
}
