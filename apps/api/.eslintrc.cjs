module.exports = {
  extends: [require.resolve('@eventon/config/eslint/base.cjs')],
  parserOptions: {
    project: './tsconfig.json',
  },
  ignorePatterns: ['dist', 'node_modules'],
};
