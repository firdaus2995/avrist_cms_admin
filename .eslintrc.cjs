module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['plugin:react/recommended', 'standard-with-typescript', 'prettier'],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: ['react'],
  rules: {
    '@typescript-eslint/explicit-function-return-type': 0,
    'react/react-in-jsx-scope': 0,
    '@typescript-eslint/triple-slash-reference': 0,
    'import/no-absolute-path': 0,
    '@typescript-eslint/consistent-type-definitions': 0,
    '@typescript-eslint/consistent-type-imports': 0,
    '@typescript-eslint/no-invalid-void-type': 0,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
