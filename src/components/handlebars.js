'use strict';

const Handlebars = require('handlebars');
const _          = require('lodash');

module.exports = function(source, config){

    config = config || {};

    let viewsLoaded = false;

    _.each(config.helpers || {}, function(helper, name){
        Handlebars.registerHelper(name, helper);
    });
    _.each(config.partials || {}, function(partial, name){
        Handlebars.registerPartial(name, partial);
    });

    function loadViews(source) {
        for (let comp of source.flatten()) {
            let defaultVariant = comp.getDefaultVariant();
            for (let variant of comp.variants) {
                Handlebars.registerPartial(variant.handle, variant.viewContent);
                if (variant.handle === defaultVariant.handle) {
                    Handlebars.registerPartial(comp.handle, variant.viewContent);
                }
            }
        }
        viewsLoaded = true;
    }

    source.on('loaded', loadViews);
    source.on('changed', loadViews);

    return {
        engine: Handlebars,
        render: function(path, str, context, meta){
            if (!viewsLoaded) loadViews(source);
            var template = Handlebars.compile(str);
            return Promise.resolve(template(context));
        }
    }
};
