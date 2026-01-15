import { expect, isolatedTest as test } from "@fixtures/index";
import { CreatePostResponseSchema, PostSchema } from "@models/JsonPlaceholderModels";

test.describe("JSONPlaceholder API - E2E: Post Lifecycle Management", () => {
    test("Complete CRUD Lifecycle - Create, Read, Update, Verify, Delete, Final Check", async ({
        jsonPlaceholderService,
    }) => {
        const originalTitle = "E2E Test Post";
        const originalBody = "This is an end-to-end test post";
        const updatedTitle = "Updated E2E Test Post";

        // ========================================
        // Step 1: Create - POST /posts, save returned id
        // ========================================
        const createPayload = {
            title: originalTitle,
            body: originalBody,
            userId: 1,
        };

        const createResponse = await jsonPlaceholderService.createPost(createPayload);

        await expect(
            createResponse,
            "Step 1: POST /posts should return 201 Created"
        ).toHaveStatusCode(201);

        const createBody = await createResponse.json();
        const parsedCreate = CreatePostResponseSchema.parse(createBody);

        // Save the returned id to a variable
        const createdPostId = parsedCreate.id;
        expect(
            createdPostId,
            "Step 1: Created post should have an id"
        ).toBeDefined();
        expect(
            createdPostId,
            "Step 1: Created post id should be 101"
        ).toBe(101);

        // ========================================
        // Step 2: Read - GET /posts/{id}, verify data matches
        // ========================================
        // Note: JSONPlaceholder is a fake API that simulates responses but doesn't persist data
        // Created posts (id > 100) won't be retrievable, so we test with an existing post
        const existingPostId = 1;
        const readResponse = await jsonPlaceholderService.getPostById(existingPostId);

        await expect(
            readResponse,
            `Step 2: GET /posts/${existingPostId} should return 200 OK`
        ).toHaveStatusCode(200);

        const readBody = await readResponse.json();
        const parsedRead = PostSchema.parse(readBody);

        // Verify the post exists and has valid data
        expect(
            parsedRead.id,
            "Step 2: Post id should match"
        ).toBe(existingPostId);
        expect(
            parsedRead.title.length,
            "Step 2: Post should have a title"
        ).toBeGreaterThan(0);
        expect(
            parsedRead.body.length,
            "Step 2: Post should have a body"
        ).toBeGreaterThan(0);

        // ========================================
        // Step 3: Update - PUT /posts/{id}, change title
        // ========================================
        const updatePayload = {
            title: updatedTitle,
            body: originalBody,
            userId: 1,
        };

        const updateResponse = await jsonPlaceholderService.updatePost(
            existingPostId,
            updatePayload
        );

        await expect(
            updateResponse,
            `Step 3: PUT /posts/${existingPostId} should return 200 OK`
        ).toHaveStatusCode(200);

        const updateBody = await updateResponse.json();
        const parsedUpdate = PostSchema.parse(updateBody);

        // Verify the response reflects the new title
        expect(
            parsedUpdate.title,
            "Step 3: Updated post title should match new title"
        ).toBe(updatedTitle);
        expect(
            parsedUpdate.id,
            "Step 3: Updated post id should remain the same"
        ).toBe(existingPostId);

        // ========================================
        // Step 4: Verify - GET /posts/{id}, confirm API responds
        // ========================================
        // Note: JSONPlaceholder doesn't persist updates, but we verify the GET still works
        const verifyResponse = await jsonPlaceholderService.getPostById(existingPostId);

        await expect(
            verifyResponse,
            `Step 4: GET /posts/${existingPostId} should return 200 OK`
        ).toHaveStatusCode(200);

        const verifyBody = await verifyResponse.json();
        const parsedVerify = PostSchema.parse(verifyBody);

        // The update won't persist in JSONPlaceholder, but we verify the resource is still accessible
        expect(
            parsedVerify.id,
            "Step 4: Post id should remain the same"
        ).toBe(existingPostId);
        expect(
            parsedVerify.title.length,
            "Step 4: Post should still have a title"
        ).toBeGreaterThan(0);

        // ========================================
        // Step 5: Delete - DELETE /posts/{id}, verify 200 or 204
        // ========================================
        const deleteResponse = await jsonPlaceholderService.deletePost(existingPostId);

        const deleteStatus = deleteResponse.status();
        expect(
            [200, 204],
            `Step 5: DELETE /posts/${existingPostId} should return 200 or 204, got ${deleteStatus}`
        ).toContain(deleteStatus);

        // ========================================
        // Step 6: Final Check - Verify API behavior after delete
        // ========================================
        // Note: JSONPlaceholder simulates DELETE but doesn't actually remove data
        // In a real API, this would return 404. Here it returns 200 (fake API limitation)
        const finalCheckResponse = await jsonPlaceholderService.getPostById(existingPostId);

        const finalStatus = finalCheckResponse.status();
        // JSONPlaceholder doesn't actually delete, so we document this behavior
        expect(
            finalStatus,
            `Step 6: JSONPlaceholder simulates DELETE but doesn't persist (returns ${finalStatus} instead of 404)`
        ).toBe(200);
    });
});
