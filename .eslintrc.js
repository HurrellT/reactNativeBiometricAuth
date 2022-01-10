module.exports = {
  root: true,
  extends: ['@react-native-community', 'airbnb', 'airbnb-typescript'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.eslint.json',
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      typescript: {
        project: '.',
      },
    },
  },
  plugins: ['@typescript-eslint'],
  rules: {
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': ['error'],
    'max-len': [
      'error',
      {
        ignoreComments: true,
        code: 100,
      },
    ],
    'eol-last': ['error', 'always'],
    'linebreak-style': 0,
    'object-curly-newline': 'off',
    'react/prop-types': 'off',
    'react/require-default-props': 'off',
    'react/jsx-one-expression-per-line': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/jsx-no-target-blank': 'off',
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: ['./src/stories/**', '**/*test.js', '**/*.spec.js', '**/storybook/**'],
      },
    ],
    'arrow-parens': ['error', 'as-needed'],
    'implicit-arrow-linebreak': 0,
  },
};
