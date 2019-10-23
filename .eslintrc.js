module.exports = {
  parser: 'babel-eslint',
  extends: [
    'airbnb',
    'prettier',
    'plugin:compat/recommended',
  ],
  env: {
    browser: true,
    node: true,
    es6: true,
    mocha: true,
    jest: true,
    jasmine: true,
  },
  globals: {
    APP_TYPE: true,
    page: true,
    Ext: true,
  },
  rules: {
    'space-before-function-paren': 'error',
    'react/jsx-filename-extension': [
      1,
      {
        extensions: [
          '.js',
        ],
      },
    ],
    'react/jsx-wrap-multilines': 0,
    'react/prop-types': 0,
    'react/forbid-prop-types': 0,
    'react/destructuring-assignment': 0,
    'react/jsx-one-expression-per-line': 0,
    'react/no-unused-state': 1,
    'import/no-unresolved': [
      2,
      {
        ignore: [
          '^@/',
          '^umi/',
        ],
      },
    ],
    'import/no-extraneous-dependencies': [
      2,
      {
        optionalDependencies: true,
        devDependencies: [
          '**/tests/**.js',
          '/mock/**.js',
          '**/**.test.js',
        ],
      },
    ],
    'jsx-a11y/no-noninteractive-element-interactions': 0,
    'jsx-a11y/click-events-have-key-events': 0,
    'jsx-a11y/no-static-element-interactions': 0,
    'jsx-a11y/anchor-is-valid': 0,
    'linebreak-style': 0,

    semi: [
      2,
      'never',
    ],
    'no-console': 0,
    'comma-dangle': [
      2,
      'always-multiline',
    ],
    'max-len': 0,
    'no-use-before-define': 2,
    'react/jsx-first-prop-new-line': 0,
    'react/jsx-filename-extension': 0,
    'react/react-in-jsx-scope': 0,
    'react/prefer-stateless-function': 0,
    'space-before-function-paren': [
      2,
      'always',
    ],
    'no-unused-expressions': [
      0,
      {
        allowShortCircuit: true,
        allowTernary: true,
      },
    ],
    'no-plusplus': [
      2,
      {
        allowForLoopAfterthoughts: true,
      },
    ],
    'no-bitwise': 0,
    'arrow-body-style': [
      0,
      'never',
    ],
    'func-names': 0,
    'prefer-const': 0,
    'no-extend-native': 0,
    'no-param-reassign': 0,
    'no-restricted-syntax': 0,
    'no-eval': 0,
    'no-continue': 0,
    'react/jsx-no-bind': 0,
    'no-unused-vars': [
      1,
      { ignoreRestSiblings: true },
    ],
    'no-underscore-dangle': 0,
    'global-require': 0,
    'import/no-unresolved': 0,
    'import/extensions': 0,
    'jsx-a11y/href-no-hash': 0,
    'react/no-array-index-key': 0,
    'react/require-default-props': 0,
    'react/forbid-prop-types': 0,
    'react/no-string-refs': 0,
    'react/no-find-dom-node': 0,
    'import/no-extraneous-dependencies': 0,
    'import/prefer-default-export': 0,
    'react/no-danger': 0,
    'jsx-a11y/no-static-element-interactions': 0,
    'linebreak-style': 0,
    'class-methods-use-this': 0,
  },
  settings: {
    polyfills: [
      'fetch',
      'promises',
      'url',
    ],
  },
}
