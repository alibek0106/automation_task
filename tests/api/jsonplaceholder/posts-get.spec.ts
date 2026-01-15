import { expect, isolatedTest as test } from "@fixtures/index";
import { PostArraySchema, PostSchema } from "@models/JsonPlaceholderModels";

test.describe("JSONPlaceholder API - Part 1 & 2: GET Posts", () => {
    test("TC 1.1: Get All Posts - Status 200, JSON content-type, response time < 800ms", async ({
        jsonPlaceholderService,
    }) => {
        const startTime = Date.now();
        const response = await jsonPlaceholderService.getAllPosts();
        const responseTime = Date.now() - startTime;

        // Verify status code is 200
        await expect(
            response,
            "GET /posts should return 200 OK"
        ).toHaveStatusCode(200);

        // Verify Content-Type is application/json
        const contentType = response.headers()["content-type"];
        expect(
            contentType,
            "Content-Type should be application/json"
        ).toContain("application/json");

        // Verify response time is < 800ms
        expect(
            responseTime,
            `Response time should be less than 800ms, got ${responseTime}ms`
        ).toBeLessThan(800);

        // Validate response schema
        const body = await response.json();
        const parsed = PostArraySchema.parse(body);
        expect(parsed.length, "Should return 100 posts").toBe(100);
    });

    test("TC 1.2: Sort Order - Verify ascending ID order", async ({
        jsonPlaceholderService,
    }) => {
        const response = await jsonPlaceholderService.getAllPosts();
        await expect(response, "GET /posts should return 200 OK").toHaveStatusCode(
            200
        );

        const posts = await response.json();
        const parsed = PostArraySchema.parse(posts);

        // Iterate through array and verify id[n] < id[n+1]
        for (let i = 0; i < parsed.length - 1; i++) {
            expect(
                parsed[i].id,
                `Post at index ${i} (id=${parsed[i].id}) should be less than next post (id=${parsed[i + 1].id})`
            ).toBeLessThan(parsed[i + 1].id);
        }
    });

    test("TC 1.3: Data Types - Validate id, userId are numbers; title, body are strings", async ({
        jsonPlaceholderService,
    }) => {
        const response = await jsonPlaceholderService.getAllPosts();
        await expect(response, "GET /posts should return 200 OK").toHaveStatusCode(
            200
        );

        const posts = await response.json();
        const parsed = PostArraySchema.parse(posts);

        // Verify data types for all posts
        parsed.forEach((post, index) => {
            expect(
                typeof post.id,
                `Post ${index}: id should be a number`
            ).toBe("number");
            expect(
                typeof post.userId,
                `Post ${index}: userId should be a number`
            ).toBe("number");
            expect(
                typeof post.title,
                `Post ${index}: title should be a string`
            ).toBe("string");
            expect(
                typeof post.body,
                `Post ${index}: body should be a string`
            ).toBe("string");
        });
    });

    test("TC 1.4: Filter Check - GET /posts?userId=1 returns 10 items with userId=1", async ({
        jsonPlaceholderService,
    }) => {
        const response = await jsonPlaceholderService.getPostsByUserId(1);
        await expect(
            response,
            "GET /posts?userId=1 should return 200 OK"
        ).toHaveStatusCode(200);

        const posts = await response.json();
        const parsed = PostArraySchema.parse(posts);

        // Verify exactly 10 items returned
        expect(
            parsed.length,
            "Should return exactly 10 posts for userId=1"
        ).toBe(10);

        // Verify all items have userId: 1
        parsed.forEach((post, index) => {
            expect(
                post.userId,
                `Post ${index}: userId should be 1`
            ).toBe(1);
        });
    });

    test("TC 2.1: Get Post 99 - Verify userId=10, id=99, non-empty title/body", async ({
        jsonPlaceholderService,
    }) => {
        const response = await jsonPlaceholderService.getPostById(99);

        // Verify status code is 200
        await expect(
            response,
            "GET /posts/99 should return 200 OK"
        ).toHaveStatusCode(200);

        // Validate response schema
        const post = await response.json();
        const parsed = PostSchema.parse(post);

        // Verify userId=10 and id=99
        expect(parsed.userId, "userId should be 10").toBe(10);
        expect(parsed.id, "id should be 99").toBe(99);

        // Verify title and body are NOT empty strings
        expect(
            parsed.title.length,
            "title should not be empty"
        ).toBeGreaterThan(0);
        expect(
            parsed.body.length,
            "body should not be empty"
        ).toBeGreaterThan(0);
    });

    test("TC 2.2: Negative - Not Found - GET /posts/150 returns 404 with empty object", async ({
        jsonPlaceholderService,
    }) => {
        const response = await jsonPlaceholderService.getPostById(150);

        // Verify status 404
        await expect(
            response,
            "GET /posts/150 should return 404 Not Found"
        ).toHaveStatusCode(404);

        // Verify response body is an empty object {}
        const body = await response.json();
        expect(
            Object.keys(body).length,
            "Response body should be an empty object"
        ).toBe(0);
    });

    test("TC 2.3: Negative - Invalid ID - GET /posts/abc returns 404 or 400", async ({
        jsonPlaceholderService,
    }) => {
        // Send GET /posts/abc by constructing the URL directly
        const response = await jsonPlaceholderService.getPostById(
            "abc" as unknown as number
        );

        // Verify status 404 or 400 (graceful error handling)
        const status = response.status();
        expect(
            [400, 404],
            `Status should be 404 or 400 for invalid ID, got ${status}`
        ).toContain(status);
    });
});
