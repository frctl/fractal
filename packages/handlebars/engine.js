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
        for (let item of source.flattenDeep()) {
            Handlebars.registerPartial('@' + item.handle, item.content);
            if (item.alias) {
                Handlebars.registerPartial('@' + item.alias, item.content);
            }
            console.log('@' + item.handle);
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
