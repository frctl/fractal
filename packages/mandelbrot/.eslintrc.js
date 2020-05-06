module.exports = {
    parser: 'babel-eslint',
    extends: ['eslint:recommended', 'plugin:prettier/recommended'],
    env: {
        browser: true,
        node: true,
    },
    ignorePatterns: ['/dist'],
};
