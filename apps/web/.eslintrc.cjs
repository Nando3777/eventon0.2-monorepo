module.exports = {
  extends: ['next', 'next/core-web-vitals', require.resolve('@eventon/config/eslint/base.cjs')],
  ignorePatterns: ['node_modules', '.next', 'dist'],
};
