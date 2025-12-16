import { APIRequestContext, APIResponse } from "@playwright/test";

export class ApiClient {
    constructor(protected readonly request: APIRequestContext) { }

    private static readonly DEFAULT_TIMEOUT_MS = 30_000;

    protected async get(url: string, options?: { params?: Record<string, string | number | boolean> }): Promise<APIResponse> {
        if (options?.params) {
            const searchParams = new URLSearchParams();
            Object.entries(options.params).forEach(([key, value]) => {
                searchParams.append(key, String(value));
            });
            const queryString = searchParams.toString();
            url = queryString ? `${url}?${queryString}` : url;
        }
        return this.request.get(url, { timeout: ApiClient.DEFAULT_TIMEOUT_MS });
    }

    protected async post(url: string, data?: Record<string, string | number | boolean>): Promise<APIResponse> {
        if (data) {
            return this.request.post(url, { form: data, timeout: ApiClient.DEFAULT_TIMEOUT_MS });
        }
        return this.request.post(url, { timeout: ApiClient.DEFAULT_TIMEOUT_MS });
    }

    protected async put(url: string, data?: Record<string, string | number | boolean>): Promise<APIResponse> {
        if (data) {
            return this.request.put(url, { form: data, timeout: ApiClient.DEFAULT_TIMEOUT_MS });
        }
        return this.request.put(url, { timeout: ApiClient.DEFAULT_TIMEOUT_MS });
    }

    protected async delete(url: string, data?: Record<string, string | number | boolean>): Promise<APIResponse> {
        if (data) {
            return this.request.delete(url, { form: data, timeout: ApiClient.DEFAULT_TIMEOUT_MS });
        }
        return this.request.delete(url, { timeout: ApiClient.DEFAULT_TIMEOUT_MS });
    }
}