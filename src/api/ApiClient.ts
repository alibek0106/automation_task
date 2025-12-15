import { APIRequestContext, APIResponse } from '@playwright/test';
import { Routes } from '../constants/Routes';

export class ApiClient {
    constructor(private request: APIRequestContext) { }

    async post(endpoint: string, data: any): Promise<APIResponse> {
        return await this.request.post(`${Routes.BASE_URL}${endpoint}`, {
            form: data
        });
    }

    async delete(endpoint: string, data: any): Promise<APIResponse> {
        return await this.request.delete(`${Routes.BASE_URL}${endpoint}`, {
            form: data
        });
    }

    async put(endpoint: string, data: any): Promise<APIResponse> {
        return await this.request.put(`${Routes.BASE_URL}${endpoint}`, {
            form: data
        });
    }
}
