module.exports = {
  testEnvironment: "node",
  testURL: "http://localhost",
  preset: "ts-jest",
  globals: {
    "ts-jest": {
      diagnostics: false,
    },
  },
  testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/dist"],
  setupFilesAfterEnv: [
    "<rootDir>/.jest/extend-expect.ts",
    "<rootDir>/.jest/setup.ts",
  ],
};
