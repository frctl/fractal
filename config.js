'use strict';

const packageJSON = require('./package.json');

module.exports = {
    version: packageJSON.version,
    env: process.env.NODE_ENV || 'production',
    project: {
        title: 'My Component Library',
        version: null,
    },
    components: {
        engine: '@frctl/handlebars',
        path: null,
        label: 'components',
        title: 'Components',
        yield: 'yield',
        splitter: '--',
        ext: '.hbs',
        default: {
            collator: function(markup, item) { return `<!-- Start: @${item.handle} -->\n${markup}\n<!-- End: @${item.handle} -->\n` },
            preview: null,
            display: {},
            context: {},
            tags: [],
            status: 'ready',
            collated: false,
            prefix: null
        },
        statuses: {
            prototype: {
                label: 'Prototype',
                description: 'Do not implement.',
                color: '#FF3333'
            },
            wip: {
                label: 'WIP',
                description: 'Work in progress. Implement with caution.',
                color: '#FF9233'
            },
            ready: {
                label: 'Ready',
                description: 'Ready to implement.',
                color: '#29CC29'
            }
        }
    },
    docs: {
        engine: '@frctl/handlebars',
        path: null,
        label: 'documentation',
        title: 'Documentation',
        markdown: true,
        ext: '.md',
        indexLabel: 'Overview',
        default: {
            context: {},
            status: null
        }
    },
    assets: {
        label: 'assets',
        title: 'Assets',
    },
    cli: {},
    web: {
        theme: '@frctl/mandelbrot',
        server: {
            watch: false,
            port: null,
            syncOptions: {},
        },
        builder: {
            dest: null,
            concurrency: 100,
        },
        static: {
            path: null,
            mount: '/',
        },
        assets: {
            mount: '_assets'
        }
    }
};
