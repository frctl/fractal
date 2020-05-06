module.exports = {
    semi: true,
    singleQuote: true,
    printWidth: 120,
    tabWidth: 4,
    overrides: [
        {
            files: ['*.json'],
            options: {
                tabWidth: 2,
            },
        },
        {
            files: ['*.scss'],
            options: {
                singleQuote: false,
            },
        },
    ],
};
