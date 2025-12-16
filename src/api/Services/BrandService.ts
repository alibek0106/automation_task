import { APIResponse } from '@playwright/test';
import { ApiClient } from '../ApiClient';
import { Routes } from '../../constants/Routes';

export class BrandService extends ApiClient {
    async getAllBrands(): Promise<APIResponse> {
        return this.get(Routes.API.BRANDS_LIST);
    }

    async putToBrandsList(): Promise<APIResponse> {
        return this.put(Routes.API.BRANDS_LIST);
    }
}


