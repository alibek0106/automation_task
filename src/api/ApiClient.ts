import { APIRequestContext, APIResponse } from "@playwright/test";

export class ApiClient {
    constructor(protected readonly request: APIRequestContext) { }

    protected async post(url: string, data: Record<string, string | number | boolean>): Promise<APIResponse> {
        return this.request.post(url, { form: data });
    }
    protected async delete(url: string, data: Record<string, string | number | boolean>): Promise<APIResponse> {
        return this.request.delete(url, { form: data });
    }
}