module.exports = {
    extends: ['stylelint-config-standard-scss', 'stylelint-config-prettier'],
    plugins: ['stylelint-scss', 'stylelint-prettier'],
    rules: {
        'prettier/prettier': true,
        indentation: 4,
        'at-rule-no-unknown': null,
        'scss/at-rule-no-unknown': true,
        'no-descending-specificity': null,
        'font-family-no-missing-generic-family-keyword': null,
        'selector-class-pattern': null,
        'property-no-vendor-prefix': null,
        'color-function-notation': null,
        'value-keyword-case': ['lower', { camelCaseSvgKeywords: true }],
        'selector-not-notation': 'simple',
    },
};
