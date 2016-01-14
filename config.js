var packageJSON = require('./package.json');

module.exports = {
    version: packageJSON.version,
    dev: false,
    log: {
        level: "warn"
    },
    project: {
        title: "Fractal",
        version: null
    },
    server: {
        port: 3000
    },
    static: {
        path: null,
        dest: "/"
    },
    build: {
        dest: "build"
    },
    theme: {
        name: "@frctl/theme-default",
        config: null,
        paths: {}
    },
    generator: {
        config: {
            name: "{{name}}.config.js"
        },
        pages: {
            name: "{{name}}.md"
        }
    },
    components: {
        path: null,
        config: "{{name}}\\.config\\.(js|json|yml|yaml)",
        readme: "readme\\.(md|markdown)",
        preview: {
            layout: null,
            yield: "yield"
        },
        splitter: "--",
        view: {
            engine: "handlebars",
            context: {}
        }
    },
    pages: {
        path: null,
        config: "{{name}}\\.config\\.(js|json|yml|yaml)",
        match: ".*\\.(html|md|markdown)",
        indexLabel: "Overview"
    },
    statuses: {
        default: "ready",
        options: [
            {
                name: "prototype",
                label: "Prototype",
                description: "Do not implement.",
                color: "red"
            },
            {
                name: "wip",
                label: "WIP",
                description: "Work in progress. Implemement with caution.",
                color: "orange"
            },
            {
                name: "ready",
                label: "Ready",
                description: "Ready to implement.",
                color: "green"
            }
        ]
    },
    engines: {
        handlebars: {
            ext: ".hbs",
            handler: "@frctl/handlebars-engine",
            extend: {
                helpers: {}
            }
        },
        nunjucks: {
            ext: ".nunjucks",
            handler: "@frctl/nunjucks-engine",
            extend: {
                filters: {},
                globals: {},
                extensions: {}
            }
        },
        mustache: {
            ext: ".mustache",
            handler: "@frctl/consolidate-engine",
            extend: {}
        }
    },
    fractal: {
        site: {
            url: "http://fractal.clearleft.com"
        },
        docs: {

        },
        bugs: {
            url: "mailto:dev@clearleft.com"
        }
    }
}
