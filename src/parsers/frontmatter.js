var matter  = require('gray-matter');
var merge   = require('deepmerge');

module.exports = FrontMatterParser;

function FrontMatterParser(){
    if (!(this instanceof FrontMatterParser)) return new FrontMatterParser();
};

FrontMatterParser.prototype.parse = function(file){
    var parsed = matter(file.raw.toString());
    var previewData = parsed.data.preview || {};
    delete parsed.data.preview;
    file.content = parsed.content.trim() + "\n";
    file.meta = merge(file.meta, parsed.data);
    file.preview = merge(file.preview, previewData);
};