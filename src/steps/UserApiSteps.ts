import { test } from "@playwright/test";
import { UserService } from "../api/UserService";
import { User } from "../models/UserModels";

export class UserApiSteps {
    constructor(private userService: UserService) { }

    async registerUser(user: User) {
        return await test.step(`API: Register User '${user.name}'`, async () => {
            const response = await this.userService.createAccount(user);
            return response;
        });
    }

    async deleteUser(email: string, password: string) {
        return await test.step(`API: Delete User '${email}'`, async () => {
            const response = await this.userService.deleteAccount(email, password);
            return response;
        });
    }
}