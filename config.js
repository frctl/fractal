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
        preview: {
            layout: null,
            yield: "yield",
            display: {}
        },
        splitter: "--",
        ext: ".hbs",
        context: {},
        props: {},
        engine: 'handlebars',
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
        markdown: true,
        ext: '.md',
        indexLabel: "Overview",
        engine: 'handlebars',
        context: {},
    }
};
