var _           = require('lodash');
var path        = require("path");
var fs          = require("fs");
var promise     = require("bluebird");

var config      = require("../config");

module.exports = function(hbs){

    var imageGridTemplate = hbs.compile(fs.readFileSync(path.join(config.get('theme.views'),'generators/image-grid.hbs'), 'utf8'));

    return function(images, options) {
        var cols = parseInt(options.hash.cols || 3, 10);
        var imageWidth = 100 / cols;
        images = _.map(images, function(image){
            return {
                url: path.join('/', image)
            };
        });
        // var output = '';
        // if (_.isString(colours)) {
        //     colours = _.compact(_.map(colours.split('|'), function(colour){
        //         return {
        //             label: null,
        //             color: _.trim(colour)
        //         };
        //     }));
        // }
        // colours = _.map(colours, function(col){
        //     if (_.isString(col)) {
        //         col = {
        //             color: col
        //         };
        //     }
        //     var c = tinycolor(col.color);
        //     col.label = col.label || null;
        //     col.isDark = c.isDark();
        //     col.isLight = c.isLight();
        //     col.formats = {'hex': c.toHexString(), 'rgb': c.toRgbString()};
        //     return col;
        // });
        // 
        return new hbs.SafeString(imageGridTemplate({
            images: images,
            cols: cols,
            imageWidth: imageWidth
        }).replace(/\r?\n|\r/g,''));
    };

};