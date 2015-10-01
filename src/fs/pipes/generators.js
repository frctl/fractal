var Handlebars  = require('handlebars');
var _           = require('lodash');

var hbs = Handlebars.create();

module.exports = Generators;

hbs.registerHelper('swatches', function(colours) {
    var output = '';
    colours = _.compact(_.map(colours.split('|'), function(colour){
        return _.trim(colour);
    }));
    _.each(colours, function(colour){
        output = output + '<span style="display: inline-block; background-color: ' + colour + '; height: 100px; width: 100px;"></span>';
    });
    return new Handlebars.SafeString('<div>' + output + '</div>');
});

function Generators(){
};

Generators.prototype.process = function(item){
    var template = hbs.compile(item.raw.toString());
    item.raw = new Buffer(template(this.getData()) + "\n", "utf-8");
    return item;
};

Generators.prototype.getData = function(){
    // TODO
    return {

    };
};
