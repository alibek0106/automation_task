import { expect, isolatedTest as test } from "@fixtures/index";
import { UserArraySchema, UserSchema, PostArraySchema } from "@models/JsonPlaceholderModels";

test.describe("JSONPlaceholder API - Part 4 & 5: GET Users and Data Consistency", () => {
    test("TC 4.1: Get All Users - Status 200, exactly 10 users", async ({
        jsonPlaceholderService,
    }) => {
        const response = await jsonPlaceholderService.getAllUsers();

        // Verify status code 200
        await expect(
            response,
            "GET /users should return 200 OK"
        ).toHaveStatusCode(200);

        // Validate response schema
        const users = await response.json();
        const parsed = UserArraySchema.parse(users);

        // Verify the list contains exactly 10 users
        expect(
            parsed.length,
            "Should return exactly 10 users"
        ).toBe(10);
    });

    test("TC 4.2: Deep Data User 5 - Verify nested Address, Geo, Company structure", async ({
        jsonPlaceholderService,
    }) => {
        const response = await jsonPlaceholderService.getUserById(5);

        await expect(
            response,
            "GET /users/5 should return 200 OK"
        ).toHaveStatusCode(200);

        const user = await response.json();
        const parsed = UserSchema.parse(user);

        // Verify User 5 basic data
        expect(parsed.id, "User id should be 5").toBe(5);
        expect(parsed.name, "User name should be Chelsey Dietrich").toBe("Chelsey Dietrich");
        expect(parsed.username, "Username should be Kamren").toBe("Kamren");
        expect(parsed.email, "Email should be Lucio_Hettinger@annie.ca").toBe("Lucio_Hettinger@annie.ca");

        // Verify Address structure
        expect(parsed.address.street, "Street should be Skiles Walks").toBe("Skiles Walks");
        expect(parsed.address.suite, "Suite should be Suite 351").toBe("Suite 351");
        expect(parsed.address.city, "City should be Roscoeview").toBe("Roscoeview");
        expect(parsed.address.zipcode, "Zipcode should be 33263").toBe("33263");

        // Verify Geo structure (nested in Address)
        expect(parsed.address.geo.lat, "Latitude should be -31.8129").toBe("-31.8129");
        expect(parsed.address.geo.lng, "Longitude should be 62.5342").toBe("62.5342");

        // Verify Company structure
        expect(parsed.company.name, "Company name should be Keebler LLC").toBe("Keebler LLC");
        expect(parsed.company.catchPhrase, "Company catchPhrase should be User-centric fault-tolerant solution").toBe("User-centric fault-tolerant solution");
        expect(parsed.company.bs, "Company bs should be revolutionize end-to-end systems").toBe("revolutionize end-to-end systems");

        // Verify phone and website
        expect(parsed.phone, "Phone should be (254)954-1289").toBe("(254)954-1289");
        expect(parsed.website, "Website should be demarco.info").toBe("demarco.info");
    });

    test("TC 4.3: Data Range - Verify geo.lat (-90 to 90), geo.lng (-180 to 180)", async ({
        jsonPlaceholderService,
    }) => {
        const response = await jsonPlaceholderService.getAllUsers();

        await expect(
            response,
            "GET /users should return 200 OK"
        ).toHaveStatusCode(200);

        const users = await response.json();
        const parsed = UserArraySchema.parse(users);

        // Verify geographic coordinate ranges for all users
        parsed.forEach((user, index) => {
            const lat = parseFloat(user.address.geo.lat);
            const lng = parseFloat(user.address.geo.lng);

            expect(
                lat,
                `User ${index + 1}: Latitude should be between -90 and 90, got ${lat}`
            ).toBeGreaterThanOrEqual(-90);
            expect(
                lat,
                `User ${index + 1}: Latitude should be between -90 and 90, got ${lat}`
            ).toBeLessThanOrEqual(90);

            expect(
                lng,
                `User ${index + 1}: Longitude should be between -180 and 180, got ${lng}`
            ).toBeGreaterThanOrEqual(-180);
            expect(
                lng,
                `User ${index + 1}: Longitude should be between -180 and 180, got ${lng}`
            ).toBeLessThanOrEqual(180);
        });
    });

    test("TC 5.1: Cross-Check User 5 - Compare /users/5 with /users list", async ({
        jsonPlaceholderService,
    }) => {
        // Get all users
        const allUsersResponse = await jsonPlaceholderService.getAllUsers();
        await expect(
            allUsersResponse,
            "GET /users should return 200 OK"
        ).toHaveStatusCode(200);

        const allUsers = await allUsersResponse.json();
        const parsedAllUsers = UserArraySchema.parse(allUsers);

        // Find User 5 in the list
        const user5FromList = parsedAllUsers.find((user) => user.id === 5);
        expect(
            user5FromList,
            "User 5 should be found in the /users list"
        ).toBeDefined();

        // Get User 5 directly
        const user5Response = await jsonPlaceholderService.getUserById(5);
        await expect(
            user5Response,
            "GET /users/5 should return 200 OK"
        ).toHaveStatusCode(200);

        const user5Direct = await user5Response.json();
        const parsedUser5Direct = UserSchema.parse(user5Direct);

        // Compare the entire JSON response - they must be identical
        expect(
            parsedUser5Direct,
            "User 5 from /users/5 should match User 5 from /users list"
        ).toEqual(user5FromList);
    });

    test("TC 5.2: Relational Check - Verify User 5's posts exist and belong to User 5", async ({
        jsonPlaceholderService,
    }) => {
        // Fetch User 5 to confirm it exists
        const userResponse = await jsonPlaceholderService.getUserById(5);
        await expect(
            userResponse,
            "GET /users/5 should return 200 OK"
        ).toHaveStatusCode(200);

        const user = await userResponse.json();
        const parsedUser = UserSchema.parse(user);
        expect(parsedUser.id, "User id should be 5").toBe(5);

        // Fetch posts for User 5
        const postsResponse = await jsonPlaceholderService.getPostsByUserId(5);
        await expect(
            postsResponse,
            "GET /posts?userId=5 should return 200 OK"
        ).toHaveStatusCode(200);

        const posts = await postsResponse.json();
        const parsedPosts = PostArraySchema.parse(posts);

        // Verify the list of posts is not empty
        expect(
            parsedPosts.length,
            "User 5 should have posts"
        ).toBeGreaterThan(0);

        // Verify all posts belong only to User 5
        parsedPosts.forEach((post, index) => {
            expect(
                post.userId,
                `Post ${index}: userId should be 5`
            ).toBe(5);
        });
    });
});
