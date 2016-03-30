'use strict';

const _         = require('lodash');
const co        = require('co');
const anymatch   = require('anymatch');
const transform = require('./transform');
const Source    = require('../source');
const md        = require('../markdown');
const resolve   = require('../context');
const utils     = require('../utils');
const Collection  = require('./collection');

module.exports = class DocsSource extends Source {

    constructor(items, app) {
        super('docs', items, app);
        this.transform = transform;
    }

    pages() {
        return super.entities();
    }

    docs() {
        return super.entities();
    }

    resolve(context) {
        return resolve(context, this);
    }

    render(page, context) {
        const self = this;

        if (!page) {
            return Promise.reject(null);
        }
        if (_.isString(page)) {
            let str = page;
            if (page.indexOf('@') === 0) {
                page = this.find(page);
                if (!page) {
                    throw new Error(`Cannot find page ${str}`);
                }
            } else {
                return fs.readFileAsync(page, 'utf8').then(content => {
                    return this.engine().render(page, content, context);
                });
            }
        }

        const renderContext = context || page.context;
        const target = page.toJSON();
        return co(function* () {
            const source  = yield (self.isLoaded ? Promise.resolve(self) : self.load());
            const context = yield self.resolve(renderContext);
            context._self = target;
            const content = yield page.getContent();
            let rendered  = yield self.engine().render(page.filePath, content, context);
            return self.setting('markdown') ? md(rendered) : rendered;
        });
    }

    renderString(str, context) {
        return this.engine().render(null, str, context || {}).then(rendered => (this.setting('markdown') ? md(rendered) : rendered));
    }

    isPage(file) {
        return anymatch(`**/*${this.setting('ext')}`, file.path);
    }

    isConfig(file) {
        return anymatch(`**/*.config.{js,json,yaml,yml}`, file.path);
    }

};
