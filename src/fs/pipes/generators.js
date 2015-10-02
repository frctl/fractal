var Handlebars  = require('handlebars');
var _           = require('lodash');
var tinycolor   = require("tinycolor2");
var path        = require("path");
var fs          = require("fs");

var config      = require("../../config");
var hbs         = Handlebars.create();

module.exports = Generators;

var swatchesTemplate = hbs.compile(fs.readFileSync(path.join(config.get('theme.views'),'generators/swatches.hbs'), 'utf8'));
hbs.registerHelper('swatches', function(colours) {
    var output = '';
    if (_.isString(colours)) {
        colours = _.compact(_.map(colours.split('|'), function(colour){
            return {
                label: null,
                color: _.trim(colour)
            };
        }));
    }
    colours = _.map(colours, function(col){
        var c = tinycolor(col.color);
        col.label = col.label || col.color;
        col.textColor = c.isDark() ? 'white' : 'black';
        return col;
    });
    return new Handlebars.SafeString(swatchesTemplate({colors: colours}));
});

function Generators(){
};

Generators.prototype.process = function(item){
    var template = hbs.compile(item.raw.toString());
    item.raw = new Buffer(template(this.getData(item)) + "\n", "utf-8");
    return item;
};

Generators.prototype.getData = function(item){
    return {
        page: item.data,
        config: config.all()
    };
};