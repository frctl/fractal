'use strict';

const Path        = require('path');
const _           = require('lodash');
const Theme       = require('@frctl/fractal').WebTheme;
const packageJSON = require('./package.json');

module.exports = function(options){

    options = _.clone(options || {});

    const theme = new Theme(Path.join(__dirname, 'views'), _.defaultsDeep(options, {
        skin: 'default',
        rtl: false,
        lang: 'en',
        stylesheet: null,
        head: null,
        foot: null,
        contextFormat: 'json'
    }));

    theme.error('pages/error.nunj');

    theme.static(Path.join(__dirname, 'dist'), '/theme');

    theme.route('/', {
        handle: 'overview',
        view: 'pages/page.nunj',
    });

    theme.route('/docs', {
        redirect: '/'
    });

    theme.route('/components', {
        redirect: '/'
    });

    theme.route('/components/preview/:handle', {
        handle: 'preview',
        view: 'pages/components/preview.nunj'
    });

    theme.route('/components/detail/:handle', {
        handle: 'component',
        view: 'pages/components/detail.nunj'
    });

    theme.route('/docs/:path([^\?]+?)', {
        handle: 'page',
        view: 'pages/page.nunj'
    });

    theme.onBuild(function(builder, app){

        const components = app.components;
        const docs       = app.docs;

        for (let comp of components.flatten()) {
            if (!comp.isHidden){
                builder.addRoute('preview', {'handle':comp.handle});
                builder.addRoute('component', {'handle':comp.handle});
            }
            for (let variant of comp.variants()) {
                builder.addRoute('preview', {'handle':variant.handle});
                if (!comp.isCollated){
                    builder.addRoute('component', {'handle':variant.handle});
                }
            }
        }

        builder.addRoute('overview');
        for (let page of docs.flatten()) {
            if (!page.isHidden && page.path !== '') {
                builder.addRoute('page', {'path':page.path});
            }
        }

    });

    return theme;
};
