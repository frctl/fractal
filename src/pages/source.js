'use strict';

const _         = require('lodash');
const co        = require('co');
const anymatch   = require('anymatch');
const transform = require('./transform');
const Source    = require('../source');
const md        = require('../markdown');
const resolve   = require('../context');
const utils     = require('../utils');

module.exports = class PageSource extends Source {

    constructor(sourcePath, props, items) {
        super(sourcePath, props, items);
        this.indexLabel = props.indexLabel;
        this.markdown   = props.markdown;
        this.transform = transform;
    }

    resolve(context) {
        return resolve(context, this);
    }

    render(page, context) {
        const self = this;
        const engine  = self.getEngine();
        const renderContext = context || page.context;
        return co(function* (){
            const source = yield (self.isLoaded ? Promise.resolve(self) : self.load());
            const context  = yield self.resolve(renderContext);
            let rendered = yield engine.render(page.filePath, page.content, context);
            return self.markdown ? md(rendered) : rendered;
        });
    }

    findByPath(path) {
        path = _.trim(path, '/');
        for (let item of this) {
            if (item.type === 'collection') {
                const search = item.findByPath(path);
                if (search) return search;
            } else if (item.path === path) {
                return item;
            }
        }
    }

    isPage(file) {
        return anymatch(`**/*${this.ext}`, file.path);
    }

    isConfig(file) {
        return anymatch(`**/*.config.{js,json,yaml,yml}`, file.path);
    }

}
