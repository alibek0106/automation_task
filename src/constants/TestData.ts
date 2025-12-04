/**
 * Centralized test data constants
 * Following Guidelines.md §4 (Configuration Management)
 * 
 * All hardcoded test values should be moved here for:
 * - Better maintainability
 * - Easy test data updates
 * - Consistent test values across tests
 */

export const TestData = {
    /**
     * Search terms for product search tests
     */
    SEARCH: {
        /** Valid search term that returns results */
        VALID_TERM_1: 'T-Shirt',
        /** Alternative valid search term */
        VALID_TERM_2: 'Jeans',
        /** Invalid search term that returns no results */
        INVALID_TERM: 'XYZ123NOTFOUND',
    },

    /**
     * Payment information for checkout tests
     */
    PAYMENT: {
        /** Test credit card number (Visa test card) */
        CARD_NUMBER: '4111 1111 1111 1111',
        /** Card CVV code */
        CVV: '123',
        /** Card expiry month (MM format) */
        EXPIRY_MONTH: '12',
        /** Card expiry year (YYYY format) */
        EXPIRY_YEAR: '2025',
    },

    /**
     * Product categories for filtering tests
     */
    CATEGORIES: {
        /** Women > Dress category */
        WOMEN_DRESS: {
            category: 'Women',
            subcategory: 'Dress',
            expectedTitle: 'Women - Dress Products',
        },
        /** Men > Jeans category */
        MEN_JEANS: {
            category: 'Men',
            subcategory: 'Jeans',
            expectedTitle: 'Men - Jeans Products',
        },
    },

    /**
     * Product brands for filtering tests
     */
    BRANDS: {
        /** Polo brand */
        POLO: {
            name: 'Polo',
            expectedTitle: 'Brand - Polo Products',
        },
        /** H&M brand */
        H_AND_M: {
            name: 'H&M',
            expectedTitle: 'Brand - H&M Products',
        },
    },

    /**
     * Checkout and order data
     */
    CHECKOUT: {
        /** Test order comment */
        ORDER_COMMENT: 'Test Order for Automation Task',
    },

    /**
     * Contact form test data
     */
    CONTACT: {
        /** Valid contact form data */
        VALID_SUBMISSION: {
            name: 'Test User Contact',
            subject: 'Test Inquiry - Automated',
            message: 'This is an automated test message to verify the contact form functionality. The message contains more than 50 characters as required for testing purposes.',
        },
        /** Invalid email formats for validation testing */
        INVALID_EMAILS: [
            'invalidemail',
            'test@',
            '@test.com',
            'test@.com',
        ],
        /** Test file for upload */
        TEST_FILE: {
            name: 'test-upload.txt',
            content: 'This is a test file for contact form upload validation.',
        },
        /** Expected success message */
        SUCCESS_MESSAGE: 'Success! Your details have been submitted successfully.',
    },
} as const;
