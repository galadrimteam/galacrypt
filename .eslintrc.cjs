module.exports = {
  root: true,
  env: { es2020: true },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'eslint-config-prettier', 'plugin:prettier/recommended'],
  ignorePatterns: ['build', 'bin', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: [],
  rules: {}
}
