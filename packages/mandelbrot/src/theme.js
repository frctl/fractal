'use strict';

const Path        = require('path');
const _           = require('lodash');
const Theme       = require('@frctl/fractal').WebTheme;
const packageJSON = require('../package.json');

module.exports = function(options){

    const config = _.defaultsDeep(_.clone(options || {}), {
        skin: 'default',
        rtl: false,
        lang: 'en',
        stylesheet: null,
        format: 'json',
    });

    config.stylesheet = config.stylesheet || `/theme/css/${config.skin || 'default'}.css`;

    const theme = new Theme(Path.join(__dirname, '../views'), config);

    theme.setErrorView('pages/error.nunj');

    theme.addStatic(Path.join(__dirname, '../dist'), '/theme');

    theme.addRoute('/', {
        handle: 'overview',
        view: 'pages/doc.nunj',
    });

    theme.addRoute('/docs', {
        redirect: '/'
    });

    theme.addRoute('/components', {
        redirect: '/'
    });

    theme.addRoute('/components/preview/:handle', {
        handle: 'preview',
        view: 'pages/components/preview.nunj'
    }, function(app){
        const handles = [];
        app.components.filter('isHidden', false).flatten().each(comp => {
            handles.push(comp.handle);
            if (comp.variants().size > 1) {
                comp.variants().each(variant => handles.push(variant.handle));
            }
        });
        return handles.map(h => ({handle: h}));
    });

    theme.addRoute('/components/detail/:handle', {
        handle: 'component',
        view: 'pages/components/detail.nunj'
    }, function(app){
        const handles = [];
        app.components.filter('isHidden', false).flatten().each(comp => {
            handles.push(comp.handle);
            if (!comp.isCollated) {
                comp.variants().each(variant => handles.push(variant.handle));
            }
        });
        return handles.map(h => ({handle: h}));
    });

    theme.addRoute('/docs/:path([^\?]+?)', {
        handle: 'page',
        view: 'pages/doc.nunj'
    }, function(app){
        return app.docs.filter(d => (!d.isHidden && d.path !== '')).flatten().map(page => ({path: page.path}));
    });

    theme.on('init', function(env, app){
        require('./filters')(theme, env, app);
    });

    return theme;
};
