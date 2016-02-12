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

module.exports = class PageSource extends Source {

    constructor(sourcePath, props, items) {
        super(sourcePath, props, items);
        this.indexLabel = props.indexLabel;
        this.markdown   = props.markdown;
        this.transform = transform;
    }

    pages() {
        return super.entities();
    }

    resolve(context) {
        return resolve(context, this);
    }

    render(page, context) {
        const self = this;
        const engine  = self.engine();
        const renderContext = context || page.context;
        return co(function* () {
            const source = yield (self.isLoaded ? Promise.resolve(self) : self.load());
            const context  = yield self.resolve(renderContext);
            let rendered = yield engine.render(page.filePath, page.content, context);
            return self.markdown ? md(rendered) : rendered;
        });
    }

    isPage(file) {
        return anymatch(`**/*${this.ext}`, file.path);
    }

    isConfig(file) {
        return anymatch(`**/*.config.{js,json,yaml,yml}`, file.path);
    }

};
