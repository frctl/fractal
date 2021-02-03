'use strict';

const Path = require('path');
const _ = require('lodash');
const Theme = require('@frctl/web').Theme;
const packageJSON = require('../package.json');

module.exports = function (options) {
    const config = _.defaultsDeep(_.clone(options || {}), {
        skin: 'default',
        rtl: false,
        lang: 'en',
        styles: 'default',
        highlightStyles: 'default',
        scripts: 'default',
        format: 'json',
        static: {
            mount: 'themes/mandelbrot',
        },
        version: packageJSON.version,
        favicon: null,
        labels: {
            info: 'Information',
            builtOn: 'Built on',
            search: {
                label: 'Search',
                placeholder: 'Search…',
                clear: 'Clear search',
            },
            navigation: {
                back: 'Back',
            },
            tree: {
                collapse: 'Collapse tree',
            },
            components: {
                handle: 'Handle',
                tags: 'Tags',
                variants: 'Variants',
                context: {
                    empty: 'No context defined.',
                },
                notes: {
                    empty: 'No notes defined.',
                },
                preview: {
                    label: 'Preview',
                    withLayout: 'With layout',
                    componentOnly: 'Component only',
                },
                path: 'Filesystem Path',
                references: 'References',
                referenced: 'Referenced by',
                resources: {
                    file: 'File',
                    content: 'Content',
                    previewUnavailable: 'Previews are currently not available for this file type.',
                    url: 'URL',
                    path: 'Filesystem Path',
                    size: 'Size',
                },
            },
            panels: {
                html: 'HTML',
                view: 'View',
                context: 'Context',
                resources: 'Resources',
                info: 'Info',
                notes: 'Notes',
            },
        },
    });
    config.skin =
        typeof config.skin === 'string'
            ? {
                  name: config.skin,
              }
            : {
                  name: 'default',
                  ...config.skin,
              };
    const uiStyles = []
        .concat(config.styles)
        .concat(config.stylesheet)
        .filter((url) => url)
        .map((url) => (url === 'default' ? `/${config.static.mount}/css/${config.skin.name}.css` : url));
    const highlightStyles = []
        .concat(config.highlightStyles)
        .filter((url) => url)
        .map((url) => (url === 'default' ? `/${config.static.mount}/css/highlight.css` : url));

    config.information = (
        config.information || [
            {
                label: config.labels.builtOn,
                value: new Date(),
                type: 'time',
                format: (value) => {
                    return value.toLocaleDateString(config.lang);
                },
            },
        ]
    ).map((item) => ({
        format: (value) => {
            return value;
        },
        type: 'string',
        ...item,
    }));
    config.panels = config.panels || ['html', 'view', 'context', 'resources', 'info', 'notes'];
    config.nav = config.nav || ['search', 'components', 'docs', 'assets', 'information'];
    config.styles = [].concat(uiStyles).concat(highlightStyles);
    config.scripts = []
        .concat(config.scripts)
        .filter((url) => url)
        .map((url) => (url === 'default' ? `/${config.static.mount}/js/mandelbrot.js` : url));
    config.favicon = config.favicon || `/${config.static.mount}/favicon.ico`;

    const theme = new Theme(Path.join(__dirname, '..', 'views'), config);

    theme.setErrorView('pages/error.nunj');

    theme.addStatic(Path.join(__dirname, '..', 'dist'), `/${config.static.mount}`);

    theme.addRoute('/', {
        handle: 'overview',
        view: 'pages/doc.nunj',
    });

    theme.addRoute('/docs', {
        redirect: '/',
    });

    theme.addRoute('/components', {
        redirect: '/',
    });

    theme.addRoute('/assets', {
        redirect: '/',
    });

    theme.addRoute(
        '/assets/:name',
        {
            handle: 'asset-source',
            view: 'pages/assets.nunj',
        },
        function (app) {
            return app.assets.visible().map((asset) => ({ name: asset.name }));
        }
    );

    theme.addRoute(
        '/components/preview/:handle',
        {
            handle: 'preview',
            view: 'pages/components/preview.nunj',
        },
        getHandles
    );

    theme.addRoute(
        '/components/render/:handle',
        {
            handle: 'render',
            view: 'pages/components/render.nunj',
        },
        getHandles
    );

    theme.addRoute(
        '/components/detail/:handle',
        {
            handle: 'component',
            view: 'pages/components/detail.nunj',
        },
        getHandles
    );

    theme.addRoute(
        '/components/raw/:handle/:asset',
        {
            handle: 'component-resource',
            static: function (params, app) {
                const component = app.components.find(`@${params.handle}`);
                if (component) {
                    return Path.join(component.viewDir, params.asset);
                }
                throw new Error('Component not found');
            },
        },
        getResources
    );

    theme.addRoute(
        '/docs/:path([^?]+?)',
        {
            handle: 'page',
            view: 'pages/doc.nunj',
        },
        function (app) {
            return app.docs
                .filter((d) => !d.isHidden && d.path !== '')
                .flatten()
                .map((page) => ({ path: page.path }));
        }
    );

    theme.on('init', function (env, app) {
        require('./filters')(theme, env, app);
    });

    let handles = null;

    function getHandles(app) {
        app.components.on('updated', () => (handles = null));
        if (handles) {
            return handles;
        }
        handles = [];
        app.components.flatten().each((comp) => {
            handles.push(comp.handle);
            if (comp.variants().size > 1) {
                comp.variants().each((variant) => handles.push(variant.handle));
            }
        });
        handles = handles.map((h) => ({ handle: h }));
        return handles;
    }

    function getResources(app) {
        let params = [];
        app.components.flatten().each((comp) => {
            params = params.concat(
                comp
                    .resources()
                    .flatten()
                    .toArray()
                    .map((res) => {
                        return {
                            handle: comp.handle,
                            asset: res.base,
                        };
                    })
            );
        });
        return params;
    }

    return theme;
};
