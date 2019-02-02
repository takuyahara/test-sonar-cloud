global.___loader = {
  enqueue: jest.fn(),
}

process.env.NODE_CONFIG = JSON.stringify(
  require('./config/default.json'),
);

if (typeof window !== 'undefined') {
  // fetch() polyfill for making API calls.
  require('whatwg-fetch');
}