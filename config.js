'use strict';

var packageJSON = require('./package.json');

module.exports = {
    version: packageJSON.version,
    env: process.env.NODE_ENV || 'production',
    log: {
        level: "warn"
    },
    project: {
        title: "Fractal",
        version: null
    },
    components: {
        path: null,
        readme: "readme.{md,markdown}",
        preview: {
            layout: null,
            yield: "yield",
            display: {}
        },
        splitter: "--",
        view: {
            engine: "@frctl/handlebars-engine",
            ext: null,
            extend: {},
            context: {}
        },
        status: {
            default: "ready",
            options: {
                prototype: {
                    label: "Prototype",
                    description: "Do not implement.",
                    color: "red"
                },
                wip: {
                    label: "WIP",
                    description: "Work in progress. Implemement with caution.",
                    color: "orange"
                },
                ready: {
                    label: "Ready",
                    description: "Ready to implement.",
                    color: "green"
                }
            },
            mixed: {
                handle: 'mixed',
                label: "Mixed",
                description: "This component has variants of differing statuses",
                color: "#666"
            }
        }
    },
    pages: {
        path: null,
        ext: '.md',
        indexLabel: "Overview",
        extend: {
            filters: {},
            globals: {},
            extensions: {}
        }
    }
};
