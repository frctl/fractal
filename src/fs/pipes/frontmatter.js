var matter  = require('gray-matter');
var merge   = require('deepmerge');

module.exports = FrontMatter;

function FrontMatter(){
};

FrontMatter.prototype.process = function(item){
    var parsed = matter(item.raw.toString());
    var previewData = parsed.data.preview || {};
    delete parsed.data.preview;
    item.raw = item.content = new Buffer(parsed.content.trim() + "\n", "utf-8");
    item.meta = merge(item.meta, parsed.data);
    item.previewData = merge(item.previewData, previewData);
    return item;
};