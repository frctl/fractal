'use strict';

const _            = require('lodash');
const beautifyHTML = require('js-beautify').html;


module.exports = function(theme, env, app){

    env.engine.addFilter('url', function(item){
        if (item.isDoc) {
            if (!item.path) {
                return '/';
            }
            return theme.urlFromRoute('page', {path: item.path})
        } else if (item.isComponent || item.isVariant) {
            return theme.urlFromRoute('component', {handle: item.handle})
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
