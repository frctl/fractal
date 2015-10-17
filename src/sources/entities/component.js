/**
 * Module dependencies.
 */

var Promise     = require('bluebird');
var _           = require('lodash');

var mixin       = require('./entity');
var utils       = require('../../utils');

/*
 * Export the component.
 */

module.exports = Component;

/*
 * Group constructor.
 *
 * @api private
 */

function Component(source){
    this.type = 'component';
    this.source = source;
    this.files = {};
};

mixin.call(Component.prototype);

Component.createFromDirectory = function(dir, config){

    var files = buildFileList(dir.children, config.files);
    var primary = _.find(files, primary, true).matched;

    var meta = {
        // title: 
    };

    // var parsed = utils.parseFrontMatter();
    return new Component(primary, files).init();
};

Component.createFromFile = function(file, config){
    var files = buildFileList(file, config.files);

};

function buildFileList(files, config){
    files = _.isArray(files) ? files : [files];
    return _.mapValues(config, function(definition, key){
        definition.matched = _.filter(files, function(entity){
            return (entity.isFile() && entity.matches(definition.matches));
        });
        if (!definition.multiple || definition.primary) {
            definition.matched = _.first(definition.matched) || [];
        }
        definition.matched = definition.matched.length ? definition.matched : null;
        return definition;
    });
}