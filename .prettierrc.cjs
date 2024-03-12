module.exports = {
  trailingComma: 'es5',
  tabWidth: 2,
  semi: true,
  singleQuote: true,
  quoteProps: 'consistent',
  bracketSpacing: true, // {*bracketSpacing*}
  arrowParens: 'always', // (always perentheses around arrow args) => {}
  printWidth: 140, // Max 140 characters per line
  overrides: [
    {
      files: ['*.json', '.prettierrc.js', '.eslintrc.js', '.prettierrc.cjs', '.eslintrc.cjs', '*.css'],
      options: {
        tabWidth: 2,
        singleQuote: true,
        trailingComma: 'none',
        semi: false
      }
    }
  ]
}
