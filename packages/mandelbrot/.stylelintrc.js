module.exports = {
    extends: ['stylelint-config-standard', 'stylelint-config-prettier'],
    plugins: ['stylelint-scss', 'stylelint-prettier'],
    rules: {
        'prettier/prettier': true,
        indentation: 4,
        'at-rule-no-unknown': null,
        'scss/at-rule-no-unknown': true,
        'no-descending-specificity': null,
        'font-family-no-missing-generic-family-keyword': null,
    },
};
