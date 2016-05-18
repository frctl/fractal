'use strict';

const Path        = require('path');
const _           = require('lodash');
const Theme       = require('@frctl/fractal').WebTheme;
const packageJSON = require('./package.json');

module.exports = function(options){

    const config = _.defaultsDeep(_.clone(options || {}), {
        skin: 'default',
        rtl: false,
        lang: 'en',
        stylesheet: null,
        contextFormat: 'json',
    });
    config.stylesheet = `/theme/css/${config.skin || 'default'}.css`;

    const theme = new Theme(Path.join(__dirname, 'views'), config);

    theme.setErrorView('pages/error.nunj');

    theme.addStatic(Path.join(__dirname, 'dist'), '/theme');

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
    });

    theme.addRoute('/components/detail/:handle', {
        handle: 'component',
        view: 'pages/components/detail.nunj'
    });

    theme.addRoute('/docs/:path([^\?]+?)', {
        handle: 'page',
        view: 'pages/doc.nunj'
    });

    theme.on('init', function(env, app){

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

    });

    //
    // % set contextFormat = frctl.theme.get('contextFormat') | lower %}
    //
    //  {% if entity.isComponent and entity.isCollated %}
    //     {% set viewContent = entity.variants().getCollatedContentSync() %}
    //     {% set ctx = entity.variants().getCollatedContext() | async %}
    // {% elif entity.isComponent %}
    //     {% set viewContent = entity.variants().default().getContentSync() %}
    //     {% set ctx = entity.variants().default().getResolvedContext() | async %}
    // {% else %}
    //     {% set viewContent = entity.getContentSync() %}
    //     {% set ctx = entity.getResolvedContext() | async %}
    // {% endif %}
    //
    // {% set contextString = ctx | format(contextFormat) %}


    // theme.onBuild(function(builder, app){
    //
    //     const components = app.components;
    //     const docs       = app.docs;
    //
    //     for (let comp of components.flatten()) {
    //         if (!comp.isHidden){
    //             builder.addRoute('preview', {'handle':comp.handle});
    //             builder.addRoute('component', {'handle':comp.handle});
    //         }
    //         for (let variant of comp.variants()) {
    //             builder.addRoute('preview', {'handle':variant.handle});
    //             if (!comp.isCollated){
    //                 builder.addRoute('component', {'handle':variant.handle});
    //             }
    //         }
    //     }
    //
    //     builder.addRoute('overview');
    //     for (let page of docs.flatten()) {
    //         if (!page.isHidden && page.path !== '') {
    //             builder.addRoute('page', {'path':page.path});
    //         }
    //     }
    //
    // });

    return theme;
};
