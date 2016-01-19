
var Promise = require('bluebird');
var _ = require('lodash');

var app         = require('./application');

module.exports = {

    load: function(){
        return Promise.props({
            components: app.getComponents(),
            pages: app.getPages(),
            statuses: app.getStatuses(),
            config: app.get(),
        }).then(apiFactory);
    }

};

function apiFactory(entities){

    function collect(collection, opts){
        if (opts.flatten && !opts.grouped) {
            collection = collection.flatten();
        } else if (opts.flatten && opts.grouped) {
            collection = collection.flattenWithGroups();
        }
        if (opts.hidden === false) {
            collection = collection.flattenWithGroups();
        }
        return collection;
    }

    return {

        get components(){
            return this.getComponents();
        },

        get pages(){
            return this.getPages();
        },

        get config(){
            return this.getConfig();
        },

        get statuses(){
            return this.getStatuses();
        },

        getComponents: function(opts){
            var opts = opts || {};
            return collect(app.getComponents().value(), opts);
        },

        getPages: function(opts){
            var opts = opts || {};
            return collect(app.getPages().value(), opts);
        },

        getStatuses: function(){
            return entities.statuses;
        },

        getConfig: function(path){
            if (path) {
                return _.get(entities.config, path);
            }
            return entities.config;
        }
    }
}
