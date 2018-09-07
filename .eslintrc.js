module.exports = {
  parserOptions: {
    parser: "babel-eslint",
    sourceType: 'module'
  },

  env: {
    es6: true,
    node: true,
    browser: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/essential' // or 'plugin:vue/base'
  ],
  // add your custom rules here
  rules: {
    'no-console': 0,
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'comma-dangle': ['error', 'only-multiline'],
    'object-curly-spacing': 0,
    'space-before-function-paren': 0,
    'jsx-quotes': 0,
    'vue/require-v-for-key': 0
  }
}