module.exports = {
  extends: ['airbnb', 'airbnb/hooks', 'airbnb-typescript', 'prettier'],
  rules: {
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'no-param-reassign': 'off',
    quotes: ['error', 'single', { avoidEscape: true }],
    'react/function-component-definition': 'off',
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/require-default-props': 'off',
    'import/prefer-default-export': 'off',
  },
  ignorePatterns: ['.eslintrc.js', 'vite.config.ts'],
  parserOptions: {
    project: './tsconfig.json',
  },
};
