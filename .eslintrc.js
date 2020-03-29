module.exports = {
  extends: 'airbnb-typescript/base',
  parserOptions: {
    project: './tsconfig.json',
  },
  env: {
    jest: true
  },
  rules: {
    'linebreak-style': 0,
    'no-console': "off",
    'no-prototype-builtins': "off"
  }
};
