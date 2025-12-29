import path from 'path';

export class TestDataProvider {
    /**
     * Resolves the absolute path to a file in the tests/testData directory.
     * @param fileName The name of the file in tests/testData
     * @returns The absolute path to the file
     */
    static getTestFilePath(fileName: string): string {
        return path.join(process.cwd(), 'tests', 'testData', fileName);
    }
}
