module.exports = {
  plugins: ['react-refresh'],
  extends: ['airbnb', 'airbnb-typescript', 'airbnb/hooks', 'prettier'],
  rules: {
    'no-unused-vars': 'off', // base rule must be disabled: https://typescript-eslint.io/rules/no-unused-vars/
    '@typescript-eslint/no-unused-vars': [
      'error',
      { varsIgnorePattern: '^_', argsIgnorePattern: '^_' },
    ],
    // adapted from: https://github.com/iamturns/eslint-config-airbnb-typescript/blob/8ef77c928c97d977f053c9c638831363a715d4a9/lib/shared.js#L41-L58
    // allow for leading underscore
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'variable',
        format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
        leadingUnderscore: 'allow',
      },
      { selector: 'function', format: ['camelCase', 'PascalCase'] },
      { selector: 'typeLike', format: ['PascalCase'] },
    ],
    '@typescript-eslint/lines-between-class-members': [
      'error',
      'always',
      { exceptAfterSingleLine: true },
    ],
    '@typescript-eslint/no-use-before-define': ['error', { functions: false }],
    '@typescript-eslint/switch-exhaustiveness-check': 'error',
    'arrow-body-style': 'warn',
    'consistent-return': 'off',
    'default-case': 'off',
    'no-param-reassign': 'off',
    quotes: ['error', 'single', { avoidEscape: true }],
    'react/function-component-definition': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/require-default-props': 'off',
    'import/prefer-default-export': 'off',
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
  },
  ignorePatterns: ['.eslintrc.js', 'vite.config.ts'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
};
