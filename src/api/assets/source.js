'use strict';

const Promise         = require('bluebird');
const _               = require('lodash');
const anymatch        = require('anymatch');
const Path            = require('path');

const Asset           = require('./asset');
const AssetCollection = require('./collection');
const fs              = require('../../core/fs');
const utils           = require('../../core/utils');
const Log             = require('../../core/log');
const mix             = require('../../core/mixins/mix');
const Source          = require('../../core/mixins/source');
const Stream          = require('../../core/promise-stream');

module.exports = class AssetSource extends mix(Source) {

    constructor(name, config, app){
        super();
        this.initSource(name, config, app);
        this.config(config);
        this.match = config.match ? [].concat(config.match) : ['*','**/*'];
    }

    assets() {
        return this.newSelf(this.toArray().filter(i => i.isAsset));
    }

    toVinylArray() {
        return this.filter('isAsset').flatten().map(asset => asset.toVinyl()).toArray();
    }

    toVinylStream() {
        return new Stream(this.load().then(() => this.toVinylArray()));
    }

    gulpify() {
        return this.toVinylStream();
    }

    toJSON() {
        const self        = super.toJSON();
        self.name         = this.name;
        self.label        = this.label;
        self.title        = this.title;
        self.path         = this.get('path');
        self.isLoaded     = this.isLoaded;
        self.isCollection = true;
        self.isSource     = true;
        self.items = this.toArray().map(i => (i.toJSON ? i.toJSON() : i));
        return self;
    }

    _getTree() {
        return fs.globDescribe(this.get('path'), this.match);
    }

    _appendEventFileInfo(file, eventData) {
        eventData = super._appendEventFileInfo(file, eventData);
        eventData.isAsset = true;
        return eventData;
    }

    _parse (fileTree) {
        let source = this;
        function convert(items) {
            let converted = [];
            for (let item of items) {
                if (item.isFile) {
                    converted.push(new Asset(item, source.get('path'), source))
                } else if (item.children.length) {
                    converted.push(new AssetCollection({}, convert(item.children)));
                }
            }
            return converted;
        }
        this.setItems(convert(fileTree.children));
    }

};
