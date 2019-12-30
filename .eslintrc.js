module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    'jest/globals': true
  },
  extends: ['eslint:recommended', 'prettier'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
    process: 'readonly'
  },
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2018
  },
  plugins: ['jest']
};
