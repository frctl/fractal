var marked = require('marked');

module.exports = Markdown;

function Markdown(){
};

Markdown.prototype.process = function(item){
    item.content = new Buffer(marked(item.raw.toString()) + "\n", "utf-8");
    return item;
};