module.exports = {
    extends: ['stylelint-config-standard-scss'],
    plugins: ['stylelint-scss'],
    rules: {
        'at-rule-no-unknown': null,
        'scss/at-rule-no-unknown': true,
        'no-descending-specificity': null,
        'font-family-no-missing-generic-family-keyword': null,
        'selector-class-pattern': null,
        'property-no-vendor-prefix': null,
        'color-function-notation': null,
        'value-keyword-case': ['lower', { camelCaseSvgKeywords: true }],
        'selector-not-notation': 'simple',
        'declaration-block-no-redundant-longhand-properties': null,
    },
};
