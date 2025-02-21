module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/*.test.ts', '**/*.test.js'],
    coverageDirectory: './coverage',
    collectCoverage: true,
};