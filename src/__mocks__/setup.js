// Polyfill for TextEncoder/TextDecoder
const { TextEncoder, TextDecoder } = require("util");
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock import.meta.env
global.import = {};
global.import.meta = {
  env: {
    VITE_API_BASE_URL: "https://test-api.example.com/api",
    MODE: "test",
  },
};
