var marked = require('marked');

module.exports = MarkdownParser;

function MarkdownParser(){
    if (!(this instanceof MarkdownParser)) return new MarkdownParser();
};

MarkdownParser.prototype.parse = function(file){
    file.content = function(raw){
        return marked(raw);
    };
};