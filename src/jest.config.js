const config = {
    projects: [
        {
            preset: 'ts-jest',
            testEnvironment: 'node',
            displayName: 'editor',
            testMatch: ['<rootDir>/ms_editor/**/*.test.ts'],
        },
        {
            preset: 'ts-jest',
            testEnvironment: 'node',
            displayName: 'users',
            testMatch: ['<rootDir>/ms_users/**/*.test.ts'],
        },
    ],
};
module.exports = config;