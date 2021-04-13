modules.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'airbnb-typescript',
    'plugin:node/recommended-module',
    'plugin:eslint-comments/recommended',
    'plugin:prettier/recommended',
  ],
};
