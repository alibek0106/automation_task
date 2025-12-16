import { APIResponse } from '@playwright/test';
import { ApiClient } from './ApiClient';
import { Routes } from '../constants/Routes';

export class SearchService extends ApiClient {
    async searchProduct(searchProduct: string): Promise<APIResponse> {
        return this.post(Routes.API.SEARCH_PRODUCT, { search_product: searchProduct });
    }

    async searchProductWithoutParameter(): Promise<APIResponse> {
        return this.post(Routes.API.SEARCH_PRODUCT);
    }
}


