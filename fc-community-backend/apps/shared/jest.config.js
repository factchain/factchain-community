// eslint-disable-next-line no-undef
module.exports = {
    testEnvironment: "node",
    testMatch: ["**/__tests__/**/*.test.ts?(x)"],
    testPathIgnorePatterns: ["<rootDir>/lib"],
    transform: {
      "^.+\\.(t|j)sx?$": "@swc/jest",
    },
  };
  