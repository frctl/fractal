module.exports = {
    parser: 'babel-eslint',
    parserOptions: {
        ecmaVersion: 6,
    },
    extends: ['eslint:recommended', 'plugin:prettier/recommended'],
    env: {
        browser: true,
        node: true,
        es6: true,
    },
    ignorePatterns: ['/**/node_modules/*', '**/dist/**'],
    overrides: [
        {
            files: ['**/test/**'],
            env: {
                mocha: true,
            },
        },
    ],
};
