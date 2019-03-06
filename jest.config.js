module.exports = {
  collectCoverageFrom: [
    "src/components/**/*.{js,jsx,ts,tsx}",
    "!src/components/seo.tsx",
    "!src/components/**/Status.ts",
    "!src/pages/**/*",
    "!src/utils/**/*",
    "!src/html.tsx",
    "!**/*.d.ts"
  ],
  testMatch: [
    "<rootDir>/__tests__/**/*.test.(j|t)s?(x)"
  ],
  transform: {
    '^.+\\.(j|t)sx?$': `<rootDir>/jest-preprocess.js`,
  },
  moduleNameMapper: {
    "^utils/(.+)": "<rootDir>/src/utils/$1",
    "^AxlMetronome/(.+)": "<rootDir>/src/components/AxlMetronome/$1",
    '.+\\.(css|styl|less|sass|scss)$': `identity-obj-proxy`,
    "^.+\\.module\\.(css|sass|scss)$": "identity-obj-proxy",
    '.+\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': `<rootDir>/__mocks__/file-mock.js`,
  },
  testPathIgnorePatterns: [`node_modules`, `.cache`],
  transformIgnorePatterns: [`node_modules/(?!(gatsby)/)`],
  snapshotSerializers: [
    "enzyme-to-json/serializer"
  ],
  globals: {
    __PATH_PREFIX__: "",
  },
  testURL: `http://localhost`,
  setupFiles: ["<rootDir>/loadershim.js"],
  watchPathIgnorePatterns: [`stories`]
}
