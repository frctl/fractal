var _           = require('lodash');
var tinycolor   = require("tinycolor2");
var path        = require("path");
var fs          = require("fs");

var config      = require("../config");

module.exports = function(hbs){

    var swatchesTemplate = hbs.compile(fs.readFileSync(path.join(config.get('theme.views'),'generators/swatches.hbs'), 'utf8'));

    return function(colours) {
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
            if (_.isString(col)) {
                col = {
                    color: col
                };
            }
            var c = tinycolor(col.color);
            col.label = col.label || null;
            col.isDark = c.isDark();
            col.isLight = c.isLight();
            col.formats = {'hex': c.toHexString(), 'rgb': c.toRgbString()};
            return col;
        });
        return new hbs.SafeString(swatchesTemplate({colors: colours}));
    };

};