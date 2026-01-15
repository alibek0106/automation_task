import { expect, isolatedTest as test } from "@fixtures/index";
import { CreatePostResponseSchema } from "@models/JsonPlaceholderModels";

test.describe("JSONPlaceholder API - Part 3: POST Create Post", () => {
    test("TC 3.1: Create Post - Status 201, echo check, id=101", async ({
        jsonPlaceholderService,
    }) => {
        const payload = {
            title: "Test Post Title",
            body: "This is a test post body content",
            userId: 1,
        };

        const response = await jsonPlaceholderService.createPost(payload);

        // Verify status code is 201
        await expect(
            response,
            "POST /posts should return 201 Created"
        ).toHaveStatusCode(201);

        // Validate response schema
        const responseBody = await response.json();
        const parsed = CreatePostResponseSchema.parse(responseBody);

        // Echo Check: Title/Body/UserId in response match the Request
        expect(
            parsed.title,
            "Response title should match request title"
        ).toBe(payload.title);
        expect(
            parsed.body,
            "Response body should match request body"
        ).toBe(payload.body);
        expect(
            parsed.userId,
            "Response userId should match request userId"
        ).toBe(payload.userId);

        // ID Check: id is present and is 101
        expect(
            parsed.id,
            "Response should contain id=101"
        ).toBe(101);
    });

    test("TC 3.2: Empty Payload - Test API strictness", async ({
        jsonPlaceholderService,
    }) => {
        // Send POST with empty object to test API strictness
        const response = await jsonPlaceholderService.createPost({} as any);

        // The API might accept it (201) or return 400 - we're testing API behavior
        const status = response.status();

        if (status === 201) {
            // API accepts empty payload - verify response structure
            const responseBody = await response.json();
            expect(
                responseBody,
                "Response should be an object"
            ).toBeInstanceOf(Object);
            expect(
                responseBody.id,
                "Response should contain an id"
            ).toBeDefined();
        } else if (status === 400) {
            // API rejects empty payload - this is stricter behavior
            const responseBody = await response.json();
            expect(
                responseBody,
                "Error response should be an object"
            ).toBeInstanceOf(Object);
        } else {
            // Unexpected status code
            throw new Error(
                `Expected status 201 or 400, but got ${status}`
            );
        }
    });

    test("TC 3.3: Security Check - Extra field filtering (admin: true)", async ({
        jsonPlaceholderService,
    }) => {
        const payload = {
            title: "Security Test Post",
            body: "Testing if extra fields are filtered",
            userId: 1,
            admin: true, // Extra field that should be filtered
        } as any;

        const response = await jsonPlaceholderService.createPost(payload);

        // Verify status code is 201
        await expect(
            response,
            "POST /posts should return 201 Created"
        ).toHaveStatusCode(201);

        // Validate response
        const responseBody = await response.json();

        // Note: JSONPlaceholder echoes back all fields including extra ones
        // A production API should filter unknown fields for security
        // We document this behavior: JSONPlaceholder returns the extra field
        expect(
            responseBody.admin,
            "JSONPlaceholder echoes extra fields (production APIs should filter them)"
        ).toBe(true);

        // Verify standard fields are present
        expect(
            responseBody.title,
            "Response should contain title"
        ).toBe(payload.title);
        expect(
            responseBody.body,
            "Response should contain body"
        ).toBe(payload.body);
        expect(
            responseBody.userId,
            "Response should contain userId"
        ).toBe(payload.userId);
        expect(
            responseBody.id,
            "Response should contain id"
        ).toBeDefined();
    });
});
