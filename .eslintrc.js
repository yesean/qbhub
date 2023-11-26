module.exports = {
  extends: ['airbnb', 'airbnb-typescript', 'airbnb/hooks', 'prettier'],
  rules: {
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/lines-between-class-members': [
      'error',
      'always',
      { exceptAfterSingleLine: true },
    ],
    '@typescript-eslint/no-use-before-define': ['error', { functions: false }],
    '@typescript-eslint/switch-exhaustiveness-check': [
      'error',
      { requireDefaultForNonUnion: true },
    ],
    'arrow-body-style': 'warn',
    'default-case': 'off',
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
    tsconfigRootDir: __dirname,
  },
};
