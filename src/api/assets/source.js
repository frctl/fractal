'use strict';

const _        = require('lodash')
const anymatch = require('anymatch');
const Path     = require('path');

const File     = require('../files/file');
const utils    = require('../../core/utils');
const Log      = require('../../core/log');
const mix      = require('../../core/mixins/mix');
const Source   = require('../../core/mixins/source');

module.exports = class AssetSource extends mix(Source) {

    constructor(name, config, app){
        super();
        this.initSource(name, config, app);
        this.config(config);
        this.filter = config.filter ? [].concat(config.filter) : [];
        this._fileFilter = filePath => {
            if (!Path.parse(filePath).ext) {
                return true;
            }
            return anymatch(this.filter, filePath);
        };
    }

    assets() {
        return this.newSelf(this.toArray().filter(i => ! i.isCollection));
    }

    toJSON() {
        const self        = super.toJSON();
        self.name         = this.name;
        self.label        = this.label;
        self.title        = this.title;
        self.isLoaded     = this.isLoaded;
        self.isCollection = true;
        self.isSource     = true;
        self.items = this.toArray().map(i => (i.toJSON ? i.toJSON() : i));
        return self;
    }

    _appendEventFileInfo(file, eventData) {
        eventData = super._appendEventFileInfo(file, eventData);
        eventData.isAsset = true;
        return eventData;
    }

    _parse (fileTree) {
        let items = [];
        function flatten(dir) {
            for (let item of dir.children) {
                item.isFile ? items.push(new File(item)) : flatten(item);
            }
        }
        flatten(fileTree);
        this.setItems(items);
    }

};
