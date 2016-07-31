'use strict';

const Promise = require('bluebird');
const Readable = require('readable-stream').Readable;

module.exports = class PromiseStream extends Readable {

    constructor(p) {
        super({ objectMode: true });
        this._data = Promise.resolve(p);
        this._fulfilledOnInit = this._data.isFulfilled();
        if (!this._fulfilledOnInit) {
            this._data.then((items) => {
                items.forEach(i => this.push(i));
            });
        }
        this._data.catch(err => {
            this.emit('error', err);
        });
    }

    _read() {
        if (this._fulfilledOnInit) {
            this._data.value().forEach(i => this.push(i));
            this.push(null);
            return;
        }
        if (this._data.isFulfilled()) {
            this._data.finally(() => {
                this.push(null);
            });
        }
    }

};
