'use strict';

const _         = require('lodash');
const co        = require('co');
const transform = require('./transform');
const Source    = require('../source');
const md        = require('../markdown');
const resolve   = require('../context');
const fs        = require('../fs');

module.exports = class PageSource extends Source {

    constructor(sourcePath, props, items) {
        super(sourcePath, props, items);
        this.indexLabel = props.indexLabel;
        this.markdown   = props.markdown;
    }

    resolve(context) {
        return resolve(context, this);
    }

    render(page, context) {
        const self = this;
        const engine  = self.getEngine();
        const renderContext = context || page.context;
        return co(function* (){
            const source = yield (self.loaded ? Promise.resolve(self) : self.load());
            const context  = yield self.resolve(renderContext);
            let rendered = yield engine.render(page.filePath, page.content, context);
            return self.markdown ? md(rendered) : rendered;
        });
    }

    _load() {
        return fs.describe(this.sourcePath).then(fileTree => {
            return transform(fileTree, this).then(self => {
                this.loaded = true;
                return self;
            });
        });
    }
}
