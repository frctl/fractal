'use strict';

const _          = require('lodash');
const mix        = require('../../core/mixins/mix');
const Collection = require('../../core/mixins/collection');
const Stream     = require('../../core/promise-stream');

module.exports = class FileCollection extends mix(Collection) {

    constructor(config, items){
        super();
        this.setItems(items);
    }

    files() {
        return this.newSelf(this.toArray().filter(i => i.isFile));
    }

    match(test) {
        return this.newSelf(this.matchItems(this.items(), test));
    }

    matchItems(items, test) {
        const matcher = anymatch(test);
        let ret = [];
        for (let item of items) {
            if (item.isCollection) {
                let collection = item.match(test);
                if (collection.size) {
                    ret.push(collection);
                }
            } else {
                if (matcher(item.path)) {
                    ret.push(item);
                }
            }
        }
        return ret;
    }

    toVinylArray() {
        return this.filter('isAsset').flatten().map(asset => asset.toVinyl()).toArray();
    }

    toVinylStream() {
        let items = [];
        if (this.isLoaded) {
            items = Promise.resolve(this.toVinylArray());
        } else {
            items = this.load().then(() => this.toVinylArray());
        }
        return new Stream(items);
    }

    gulpify() {
        return this.toVinylStream();
    }

}
