import { expect } from '@playwright/test';
import { BrandService } from '../../src/api/BrandService';
import { Brand, BrandsListResponseSchema } from '../../src/models/BrandModels';
import { StatusCode } from '../../src/constants/StatusCode';

/**
 * BrandApiSteps - API operations for brand data
 * Used for validating brand data between API and UI
 */
export class BrandApiSteps {
    constructor(private brandService: BrandService) {}

    /**
     * Get all brands via API
     * @returns Array of brands
     */
    async getAllBrandsViaApi(): Promise<Brand[]> {
        const response = await this.brandService.getAllBrands();

        // Assert HTTP status
        expect(
            response.status(),
            `Get all brands API should return HTTP 200, got ${response.status()}`
        ).toBe(StatusCode.OK);

        // Validate response schema
        const body = await response.json();
        const parsed = BrandsListResponseSchema.parse(body);

        // Assert response code
        expect(
            parsed.responseCode,
            `Response code should be 200, got ${parsed.responseCode}`
        ).toBe(StatusCode.OK);

        return parsed.brands;
    }

    /**
     * Get brand by name from brands list
     * @param brands Array of brands
     * @param brandName Brand name to find
     * @returns Brand if found, undefined otherwise
     */
    getBrandByNameViaApi(brands: Brand[], brandName: string): Brand | undefined {
        return brands.find(brand => 
            brand.brand.toLowerCase() === brandName.toLowerCase()
        );
    }

    /**
     * Verify if brand exists in API brands list
     * @param brandName Brand name to check
     * @returns true if brand exists, false otherwise
     */
    async verifyBrandExistsViaApi(brandName: string): Promise<boolean> {
        const brands = await this.getAllBrandsViaApi();
        const brand = this.getBrandByNameViaApi(brands, brandName);
        return brand !== undefined;
    }

    /**
     * Get brand names as array of strings
     * @param brands Array of brands
     * @returns Array of brand names
     */
    getBrandNames(brands: Brand[]): string[] {
        return brands.map(brand => brand.brand);
    }
}

