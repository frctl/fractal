var matter  = require('gray-matter');
var merge   = require('deepmerge');

module.exports = FrontMatter;

function FrontMatter(){
};

FrontMatter.prototype.process = function(item){
    var parsed = matter(item.raw.toString());
    item.raw = item.content = new Buffer(parsed.content.trim() + "\n", "utf-8");
    item.data = merge(item.data, parsed.data);
    return item;
};