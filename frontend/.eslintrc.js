module.exports = {
  extends: ['react-app', 'react-app/jest'],
  rules: {
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-undef': 'error',
    'no-unused-vars': 'warn'
  },
  globals: {
    BigInt: 'readonly'
  }
};