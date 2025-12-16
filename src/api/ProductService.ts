import { APIResponse } from '@playwright/test';
import { ApiClient } from './ApiClient';
import { Routes } from '../constants/Routes';

export class ProductService extends ApiClient {
    async getAllProducts(): Promise<APIResponse> {
        return this.get(Routes.API.PRODUCTS_LIST);
    }

    async postToProductsList(): Promise<APIResponse> {
        return this.post(Routes.API.PRODUCTS_LIST);
    }
}


