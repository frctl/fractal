'use strict';

var packageJSON = require('./package.json');

module.exports = {
    version: packageJSON.version,
    env: process.env.NODE_ENV || 'production',

    project: {
        title: "My Component Library",
        version: null
    },
    components: {
        path: null,
        preview: {
            layout: null,
            yield: "yield",
            display: {},
            collator: function(markup, item) { return `<!-- Start: @${item.handle} -->\n${markup}\n<!-- End: @${item.handle} -->\n` }
        },
        splitter: "--",
        ext: ".hbs",
        context: {},
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
                label: "Multiple",
                description: "Contains items of differing statuses.",
                color: "#999"
            }
        }
    },
    docs: {
        path: null,
        markdown: true,
        ext: '.md',
        indexLabel: "Overview",
        engine: 'handlebars',
        context: {},
    }
};
