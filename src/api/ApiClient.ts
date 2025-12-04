import { APIRequestContext, APIResponse } from "@playwright/test";

export class ApiClient {
    constructor(protected readonly request: APIRequestContext) { }

    protected async post(url: string, data: Record<string, any>): Promise<APIResponse> {
        return this.request.post(url, { form: data });
    }
}