'use strict';

const nunjucks = require('nunjucks');
const _        = require('lodash');

module.exports = function(source, config){

    config = config || {};

    let viewCache = null;

    /**
     * Create a custom string loader and instantiate a new Nunjucks environment object with it.
     * We don't want to use the FileSystemLoader as we already have
     * the contents of all files cached in the component file tree.
     */

    const StringLoader = nunjucks.Loader.extend({
        getSource: function(handle) {
            handle = handle.replace('@','');
            const view = _.find(viewCache, function(view){
                return (view.handle === handle || view.alias === handle);
            });
            if (view) {
                return {
                    src: view.content,
                    path: view.path,
                    noCache: true
                };
            }
            throw new Error('Partial template not found.');
        }
    });

    const nj = new nunjucks.Environment(new StringLoader(), {
        autoescape: false
    });

    _.each(config.filters || {}, function(filter, name){
        nj.addFilter(name, filter);
    });
    _.each(config.extensions || {}, function(ext, name){
        nj.addExtension(name, ext);
    });
    _.each(config.globals || {}, function(value, name){
        nj.addGlobal(name, value);
    });

    function loadViews(source) {
        viewCache = source.flattenDeep().items();
    }

    source.on('loaded', loadViews);
    source.on('changed', loadViews);

    return {
        engine: nj,
        render: function(path, str, context, meta){
            if (!viewCache) loadViews(source);
            return Promise.resolve(nj.renderString(str, context));
        }
    };

};
