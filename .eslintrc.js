module.exports = {
    "extends": "airbnb",
    "installedESLint": true,
    "plugins": [

    ],
    "rules": {
        "no-underscore-dangle": 0,
        "quotes": ["error", "single"],
        "indent": ["error", 4],
        "object-shorthand": ["error", "methods"],
        "no-use-before-define": ["error", { "functions": false }],
        "no-param-reassign": 0,
        "strict": 0,
        "max-len": ["error", 200],
        "prefer-rest-params": 0,
        "no-useless-escape": 0,
        "global-require": 0,
        "no-shadow": 0,
        "eqeqeq": ["warn"],
        "no-restricted-syntax": 0,
        "consistent-return": 0,
        "new-cap": ["error", { "properties": false }],
    },
    "env": {
        "node": true
    }
};
