module.exports = {
  preset: 'jest-puppeteer',
  testMatch: [
    "<rootDir>/__tests-image__/**/*.test.(j|t)s?(x)"
  ],
  setupFiles: [
    './setupTests.image.js'
  ],
  testPathIgnorePatterns: [`node_modules`, `.cache`],
  transformIgnorePatterns: [`node_modules/(?!(gatsby)/)`],
  watchPathIgnorePatterns: [`stories`]
};
