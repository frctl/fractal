var Highlights                  = require('highlights');
var tidyJS                      = require('js-beautify').js;
var tidyCSS                     = require('js-beautify').css;
var tidyHTML                    = require('js-beautify').html;

var highlighter                 = new Highlights();

var codeStyle = {
    "preserve_newlines": true,
    "indent_size": 4
};

highlighter.requireGrammarsSync({
    modulePath: require.resolve('atom-handlebars/package.json')
});

module.exports = function(){

    return 'foo';

};