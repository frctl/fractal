'use strict';

const _        = require('lodash');
const Promise = require('bluebird');
const nunjucks = require('nunjucks');

module.exports = function(config){

    config = config || {};

    let viewCache = null;
    const loaders = [];

    /**
     * Create a custom string loader and instantiate a new Nunjucks environment object with it.
     * We don't want to use the FileSystemLoader as we already have
     * the contents of all files cached in the component file tree.
     */

    const StringLoader = nunjucks.Loader.extend({
        getSource: function(handle) {
            if (handle.indexOf('@') !== 0) {
                return;
            }
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
        }
    });
    loaders.push(new StringLoader());

    /**
     * If the user has specified any paths for directly loading templates,
     * also include a FileSystemLoader instance.
     */

    if (config.paths) {
        loaders.push(new nunjucks.FileSystemLoader(config.paths, {
            watch: true
        }));
    }

    /**
     * Now instantiate the Nunjucks environment instance
     * and load any helpers etc.
     */

    let nj = new nunjucks.Environment(loaders, {
        autoescape: false
    });

    nj = Promise.promisifyAll(nj);

    _.each(config.filters || {}, function(filter, name){
        addFilter(name, filter);
    });
    _.each(config.extensions || {}, function(ext, name){
        nj.addExtension(name, ext);
    });
    _.each(config.globals || {}, function(value, name){
        nj.addGlobal(name, value);
    });

    function addFilter(name, filter){
        if (typeof filter === 'function') {
            nj.addFilter(name, filter);
        } else if (typeof filter === 'object') {
            nj.addFilter(name, filter.filter, filter.async);
        }
    }

    return {

        get engine(){
            return nj;
        },

        register(source, app) {

            if (!config.pristine) {
                _.each(require('./filters')(app) || {}, function(filter, name){
                    addFilter(name, filter);
                });
                _.each(require('./extensions')(app) || {}, function(ext, name){
                    nj.addExtension(name, ext);
                });
            }

            function loadViews() {
                viewCache = source.flattenDeep().items();
            }

            source.on('loaded', () => loadViews());
            source.on('changed', data => loadViews());

            loadViews();
        },

        render(path, str, context, meta) {
            return nj.renderStringAsync(str, context);
        }

    }


};
