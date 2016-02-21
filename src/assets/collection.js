'use strict';

const Promise    = require('bluebird');
const _          = require('lodash');
const anymatch   = require('anymatch');
const Collection = require('../collection');

module.exports = class AssetCollection extends Collection {

    constructor(props, items) {
        super(props, items);
    }

    files() {
        return super.entities();
    }

    match(test) {
        return this.newSelf(this.matchItems(this.items(), test));
    }

    matchItems(items, test) {
        const matcher = anymatch(test);
        let ret = [];
        for (let item of items) {
            if (item.type === 'collection') {
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

};
