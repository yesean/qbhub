module.exports = {
  extends: [
    'react-app',
    'react-app/jest',
    'airbnb',
    'airbnb/hooks',
    'airbnb-typescript',
    'prettier',
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': 'warn',
    'arrow-body-style': 'off',
    'import/prefer-default-export': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
  },
  parserOptions: {
    project: './tsconfig.json',
  },
};
