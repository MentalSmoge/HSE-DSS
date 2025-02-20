module.exports = {
	testEnvironment: "jsdom",
	testMatch: ["**/src/**/*.test.js", "**/src/**/*.test.jsx"],
	setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"],
	moduleNameMapper: {
		"\\.(css|less|scss|sass)$": "identity-obj-proxy",
		"\\.(jpg|jpeg|png|gif|webp|svg)$": "<rootDir>/__mocks__/fileMock.js",
	},
};
