'use strict';

const promisedHbs = require('promised-handlebars');
const Handlebars  = require('handlebars');
const _           = require('lodash');

module.exports = function(source, config){

    config       = config || {};
    let instance = Handlebars;
    let helpers  = {};
    let partials = {};

    if (config.instance) {
        _.each(config.instance.helpers || {}, (helper, name) => {
            if (!Handlebars.helpers[name]) {
                helpers[name] = helper;
            }
        });
        _.each(config.instance.partials || {}, (partial, name) => {
            if (!Handlebars.partials[name]) {
                partials[name] = partial;
            }
        });
        instance = config.instance;
    }

    instance = promisedHbs(instance);

    let viewsLoaded = false;

    _.each(_.defaults(helpers, config.helpers || {}), function(helper, name){
        instance.registerHelper(name, helper);
    });
    _.each(_.defaults(partials, config.partials || {}), function(partial, name){
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
