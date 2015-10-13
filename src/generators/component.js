var _           = require('lodash');
var path        = require("path");
var fs          = require("fs");

var config      = require("../config");
var fractal      = require("../../fractal");

module.exports = function(hbs){

    var componentTemplate = hbs.compile(fs.readFileSync(path.join(config.get('theme.views'),'generators/component.hbs'), 'utf8'));

    return function(componentName, options) {
        
        return fractal.getSources().then(function(sources){
            var variantName = options.hash.variant || 'base';
            var view = options.hash.view || 'preview';
            var comp = sources.components.tryFindComponent(componentName);
            if (comp) {
                var variant = comp.getVariant(variantName) || _.first(comp.getVariants());
                console.log(variant);
                return comp.getStaticSelf().then(function(c){
                    return new hbs.SafeString(componentTemplate({
                        baseUrl: '/components',
                        component: c,
                        variant: variant
                    }).replace(/\r?\n|\r/g,'')); 
                });
            }
            return '<!-- Component not found -->';
        });
            
    };

};