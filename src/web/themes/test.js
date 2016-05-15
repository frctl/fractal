'use strict';

const Path        = require('path');
const Theme       = require('../theme');

module.exports = function(){

    const theme = new Theme(Path.join(__dirname, 'views'));

    theme.route('/', {
        handle: 'overview',
        view: 'index.nunj',
    });

    theme.route('/foo/:foo?', {
        handle: 'foo',
        view: 'index.nunj',
    });

    theme.on('init', function(env, app){
        env.engine.addGlobal('foobar', 'PPPPP');
        env.engine.addFilter('wow', function(str){
            return str + 'wow';
        });
    });

    theme.on('build', function(builder, app){
        builder.addRoute('overview');
        builder.addRoute('foo');
    });

    return theme;

};
