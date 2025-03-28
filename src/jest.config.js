const config = {
    projects: [
        {
            preset: 'ts-jest',
            testEnvironment: 'node',
            displayName: 'editor-unit',
            testMatch: ['<rootDir>/ms_editor/**/*.unit.test.ts'],
        },
        {
            preset: 'ts-jest',
            testEnvironment: 'node',
            displayName: 'editor-integration',
            testMatch: ['<rootDir>/ms_editor/**/*.int.test.ts'],
        },
        {
            preset: 'ts-jest',
            testEnvironment: 'node',
            displayName: 'users-unit',
            testMatch: ['<rootDir>/ms_users/**/*.unit.test.ts'],
        },
        {
            preset: 'ts-jest',
            testEnvironment: 'node',
            displayName: 'users-integration',
            testMatch: ['<rootDir>/ms_users/**/*.int.test.ts'],
        },
    ],
};

module.exports = config;