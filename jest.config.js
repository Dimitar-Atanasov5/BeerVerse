export default {
  reporters: [
    "default",
    ["jest-junit", {outputDirectory: "./reports/junit", ouputName: "junit.xml"},]
  ],
  coverageReporters: ["text", "lcov", "html"],
  projects: [
    {
      displayName: "unit",
      testMatch: ["<rootDir>/test/unit-tests/**/*.test.js"],
      testEnvironment: "node",
      setupFilesAfterEnv: ["<rootDir>/test/unit-tests/unitSetup.js"]
    },
    {
      displayName: "integration",
      testMatch: ["<rootDir>/test/integration-tests/**/*.test.js"],
      testEnvironment: "node",
      setupFilesAfterEnv: ["<rootDir>/test/integrationSetup.js"],
    },
  ]
};