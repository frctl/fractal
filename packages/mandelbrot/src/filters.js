'use strict';

const _            = require('lodash');
const Path         = require('path');
const beautifyHTML = require('js-beautify').html;


module.exports = function(theme, env, app){

    env.engine.addFilter('url', function(item){
        if (item.isDoc) {
            if (!item.path) {
                return '/';
            }
            return theme.urlFromRoute('page', {path: item.path});
        } else if (item.isComponent || item.isVariant) {
            return theme.urlFromRoute('component', {handle: item.handle});
        } else if (item.isAssetSource) {
            return theme.urlFromRoute('asset-source', {name: item.name});
        } else if (item.isAsset) {
            return Path.join('/', app.get('web.static'), item.srcPath);
        }
        throw new Error(`Cannot generate URL for ${item}`);
    });

    env.engine.addFilter('beautify', function(str) {
        return beautifyHTML(str, {
            // TODO: move to config
            indent_size: 4,
            preserve_newlines: true,
            max_preserve_newlines: 1
        });
    });

 };
