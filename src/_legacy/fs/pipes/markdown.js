var output  = require('../../output');

module.exports = Markdown;

function Markdown(){
};

Markdown.prototype.process = function(item){
    item.content = new Buffer(output.markdown(item.raw) + "\n", "utf-8");
    return item;
};