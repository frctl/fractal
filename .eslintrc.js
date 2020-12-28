module.exports = {
    root: true,
    parserOptions: {
        ecmaVersion: 2017,
    },
    extends: ['eslint:recommended', 'plugin:prettier/recommended', 'plugin:import/recommended'],
    env: {
        browser: true,
        node: true,
        es6: true,
    },
    plugins: ['import'],
    rules: {
        'import/no-unresolved': [
            'error',
            {
                commonjs: true,
            },
        ],
        'import/no-extraneous-dependencies': 'error',
    },
    overrides: [
        {
            files: ['**/test/**'],
            env: {
                mocha: true,
            },
        },
        {
            files: ['*.spec.js'],
            env: {
                jest: true,
            },
        },
    ],
};
