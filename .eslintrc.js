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
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
  },
  parserOptions: {
    project: './tsconfig.json',
  },
};
