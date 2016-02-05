'use strict';

module.exports = {
    port: 3000,
    static: {
        path: null,
        mount: "/"
    },
    build: {
        dest: "build",
        concurrency: 100
    },
    favicon: null,
    theme: "@frctl/theme-default"
};
