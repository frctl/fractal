'use strict';

const Handlebars = require('handlebars');
const _          = require('lodash');

module.exports = function(source, config){

    config = config || {};

    const instance = config.instance || Handlebars;
    let viewsLoaded = false;

    _.each(config.helpers || {}, function(helper, name){
        instance.registerHelper(name, helper);
    });
    _.each(config.partials || {}, function(partial, name){
        instance.registerPartial(name, partial);
    });

    function loadViews(source) {
        for (let item of source.flattenDeep()) {
            instance.registerPartial('@' + item.handle, item.content);
            if (item.alias) {
                instance.registerPartial('@' + item.alias, item.content);
            }
        }

        viewsLoaded = true;
    }

    source.on('loaded', loadViews);
    source.on('changed', loadViews);

    return {
        engine: instance,
        render: function(path, str, context, meta){
            if (!viewsLoaded) loadViews(source);
            const template = instance.compile(str);
            return Promise.resolve(template(context));
        }
    }
};
