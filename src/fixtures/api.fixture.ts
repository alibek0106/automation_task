import { UserService } from '../api/Services/UserService';
import { ProductService } from '../api/Services/ProductService';
import { BrandService } from '../api/Services/BrandService';
import { SearchService } from '../api/Services/SearchService';
import { UserApiSteps } from '../api/api-steps/UserApiSteps';
import { ProductApiSteps } from '../api/api-steps/ProductApiSteps';
import { BrandApiSteps } from '../api/api-steps/BrandApiSteps';
import { APIRequestContext } from '@playwright/test';

export type ApiFixtures = {
    userService: UserService;
    productService: ProductService;
    brandService: BrandService;
    searchService: SearchService;
    userApiSteps: UserApiSteps;
    productApiSteps: ProductApiSteps;
    brandApiSteps: BrandApiSteps;
};

export const apiFixtures = {
    userService: async ({ request }: { request: APIRequestContext }, use: (s: UserService) => Promise<void>) => {
        await use(new UserService(request));
    },
    productService: async ({ request }: { request: APIRequestContext }, use: (s: ProductService) => Promise<void>) => {
        await use(new ProductService(request));
    },
    brandService: async ({ request }: { request: APIRequestContext }, use: (s: BrandService) => Promise<void>) => {
        await use(new BrandService(request));
    },
    searchService: async ({ request }: { request: APIRequestContext }, use: (s: SearchService) => Promise<void>) => {
        await use(new SearchService(request));
    },
    userApiSteps: async ({ userService }: { userService: UserService }, use: (s: UserApiSteps) => Promise<void>) => {
        await use(new UserApiSteps(userService));
    },
    productApiSteps: async ({ productService, searchService }: { productService: ProductService; searchService: SearchService }, use: (s: ProductApiSteps) => Promise<void>) => {
        await use(new ProductApiSteps(productService, searchService));
    },
    brandApiSteps: async ({ brandService }: { brandService: BrandService }, use: (s: BrandApiSteps) => Promise<void>) => {
        await use(new BrandApiSteps(brandService));
    },
};