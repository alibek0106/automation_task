import { APIResponse } from '@playwright/test';
import { ApiClient } from '../ApiClient';
import { User } from '../../models/UserModels';
import { Routes } from '../../constants/Routes';

export class UserService extends ApiClient {
    private toAccountForm(user: User): Record<string, string> {
        return {
            name: user.name,
            email: user.email,
            password: user.password,
            title: user.title,
            birth_date: user.birthDay,
            birth_month: user.birthMonth,
            birth_year: user.birthYear,
            firstname: user.firstName,
            lastname: user.lastName,
            company: user.company,
            address1: user.address1,
            address2: user.address2 || '',
            country: user.country,
            zipcode: user.zipcode,
            state: user.state,
            city: user.city,
            mobile_number: user.mobileNumber,
        };
    }

    async createAccount(user: User): Promise<APIResponse> {
        return this.post(Routes.API.CREATE_ACCOUNT, { form: this.toAccountForm(user) });
    }

    async verifyLogin(email: string, password: string): Promise<APIResponse> {
        return this.post(Routes.API.VERIFY_LOGIN, { form: { email, password } });
    }

    async verifyLoginWithoutEmail(password: string): Promise<APIResponse> {
        return this.post(Routes.API.VERIFY_LOGIN, { form: { password } });
    }

    async deleteAccount(email: string, password: string): Promise<APIResponse> {
        return this.delete(Routes.API.DELETE_ACCOUNT, { form: { email, password } });
    }

    async updateAccount(user: User): Promise<APIResponse> {
        return this.put(Routes.API.UPDATE_ACCOUNT, { form: this.toAccountForm(user) });
    }

    async getUserDetailByEmail(email: string): Promise<APIResponse> {
        return this.get(Routes.API.GET_USER_DETAIL_BY_EMAIL, { params: { email } });
    }

    async deleteVerifyLogin(): Promise<APIResponse> {
        return this.delete(Routes.API.VERIFY_LOGIN);
    }
}