module.exports = {
    root: true,
    parserOptions: {
        ecmaVersion: 2017,
    },
    extends: ['eslint:recommended', 'plugin:prettier/recommended'],
    env: {
        browser: true,
        node: true,
        es6: true,
    },
    overrides: [
        {
            files: ['**/test/**'],
            env: {
                mocha: true,
            },
        },
    ],
};
