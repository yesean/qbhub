module.exports = {
  extends: [
    'airbnb',
    'airbnb-typescript',
    'airbnb/hooks',
    'plugin:react/jsx-runtime',
    'prettier',
  ],
  ignorePatterns: ['.eslintrc.js', 'vite.config.ts'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  plugins: [
    'react-refresh',
    'sort-keys-fix',
    'sort-destructure-keys',
    'simple-import-sort',
    'typescript-sort-keys',
  ],
  rules: {
    '@typescript-eslint/lines-between-class-members': [
      'error',
      'always',
      { exceptAfterSingleLine: true },
    ],

    // reference: https://typescript-eslint.io/rules/member-ordering/#options
    '@typescript-eslint/member-ordering': [
      'error',
      {
        classes: [
          'private-field',
          'protected-field',
          'public-field',

          'constructor',

          'public-get',
          'protected-get',
          'private-get',

          'public-set',
          'protected-set',
          'private-set',

          'public-method',
          'protected-method',
          'private-method',
        ],
      },
    ],

    // adapted from: https://github.com/iamturns/eslint-config-airbnb-typescript/blob/8ef77c928c97d977f053c9c638831363a715d4a9/lib/shared.js#L41-L58
    // allow for leading underscore
    '@typescript-eslint/naming-convention': [
      'error',
      {
        format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
        leadingUnderscore: 'allow',
        selector: 'variable',
      },
      { format: ['camelCase', 'PascalCase'], selector: 'function' },
      { format: ['PascalCase'], selector: 'typeLike' },
    ],

    '@typescript-eslint/no-unused-vars': [
      'error',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],
    'no-unused-vars': 'off', // base rule must be disabled: https://typescript-eslint.io/rules/no-unused-vars/

    '@typescript-eslint/no-use-before-define': ['error', { functions: false }],
    '@typescript-eslint/sort-type-constituents': 'error',
    '@typescript-eslint/switch-exhaustiveness-check': 'error',
    'arrow-body-style': 'warn',
    'consistent-return': 'off',
    'default-case': 'off',
    'import/prefer-default-export': 'off',
    'no-param-reassign': 'off',
    quotes: ['error', 'single', { avoidEscape: true }],
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'react/function-component-definition': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/jsx-sort-props': 'error',
    'react/prop-types': 'off',
    'react/require-default-props': 'off',
    'sort-destructure-keys/sort-destructure-keys': [
      'error',
      { caseSensitive: false },
    ],
    'sort-keys-fix/sort-keys-fix': ['error', 'asc', { caseSensitive: false }],
    'simple-import-sort/imports': 'error',
    'typescript-sort-keys/interface': 'error',
    'typescript-sort-keys/string-enum': 'error',
  },
};
