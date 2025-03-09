const config = {
    projects: [
        {
            preset: 'ts-jest',
            testEnvironment: 'node',
            displayName: 'editor',
            testMatch: ['<rootDir>/ms_editor/**/*.test.ts'],
        },
    ],
};
module.exports = config;